import { fetchAccounts } from "@/actions/accounts";
import { chromium } from "playwright";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const accounts = await fetchAccounts();

        // Send initial status
        controller.enqueue(
          encoder.encode(`data: ${
            JSON.stringify({
              type: "start",
              total: accounts.length,
            })
          }\n\n`),
        );

        for (let i = 0; i < accounts.length; i++) {
          const { login, password } = accounts[i];

          // Send account start status
          controller.enqueue(
            encoder.encode(`data: ${
              JSON.stringify({
                type: "account_start",
                login,
                current: i + 1,
                total: accounts.length,
              })
            }\n\n`),
          );

          try {
            const result = await activateCouponsWithProgress(
              login,
              password,
              (progress) => {
                // Send progress updates
                controller.enqueue(
                  encoder.encode(`data: ${
                    JSON.stringify({
                      type: "progress",
                      login,
                      ...progress,
                    })
                  }\n\n`),
                );
              },
            );

            // Send success status
            controller.enqueue(
              encoder.encode(`data: ${
                JSON.stringify({
                  type: "account_success",
                  login,
                  activatedCoupons: result.activatedCoupons,
                })
              }\n\n`),
            );
          } catch (error) {
            // Send error status
            controller.enqueue(
              encoder.encode(`data: ${
                JSON.stringify({
                  type: "account_error",
                  login,
                  error: error instanceof Error ? error.message : "Unknown error",
                })
              }\n\n`),
            );
          }
        }

        // Send completion status
        controller.enqueue(
          encoder.encode(`data: ${
            JSON.stringify({
              type: "complete",
            })
          }\n\n`),
        );
      } catch (error) {
        controller.enqueue(
          encoder.encode(`data: ${
            JSON.stringify({
              type: "error",
              error: error instanceof Error ? error.message : "Unknown error",
            })
          }\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

async function activateCouponsWithProgress(
  login: string,
  password: string,
  onProgress: (progress: any) => void,
) {
  const debugMode = false;
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
    ],
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
    locale: "pl-PL",
    viewport: { width: 1366, height: 1279 },
    bypassCSP: true,
    extraHTTPHeaders: { "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8" },
  });

  // Add additional anti-detection measures
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", { get: () => ["pl-PL", "pl"] });
  });

  const page = await context.newPage();
  if (debugMode) {
    page.on("response", (response) => {
      const status = response.status();
      const url = response.url();
      onProgress({ step: "network_response", message: `${status} ${url}` });
    });
  }

  try {
    onProgress({ step: "navigating", message: "Przechodzę do strony logowania..." });
    await page.goto("https://www.lidl.pl/mla/", { waitUntil: "networkidle" });
    await page.waitForURL((url) => url.hostname.includes("accounts.lidl.com"));
    const emailInput = 'input[name="input-email"]';
    const passInput = 'input[name="Password"]';
    const loginBtn = page.locator('button[data-submit="true"]');
    await page.waitForSelector(emailInput);

    const maxLoginAttempts = 7;
    let loginSuccess = false;
    for (let attempt = 1; attempt <= maxLoginAttempts; attempt++) {
      onProgress({
        step: "login_attempt",
        message: `Próba logowania ${attempt}/${maxLoginAttempts}`,
      });

      await page.fill(emailInput, "");
      await page.fill(emailInput, login);
      await page.fill(passInput, "");
      await page.fill(passInput, password);
      await loginBtn.focus();
      await page.keyboard.press("Space");
      await page.waitForTimeout(300);

      try {
        // Wait for either successful redirect to lidl.pl domain
        onProgress({ step: "verifying_login", message: "Sprawdzam status logowania..." });
        await page.waitForURL((url) => url.hostname.includes("lidl.pl"), { timeout: 2000 });
        loginSuccess = true;
        // If we reach here, login was successful
        onProgress({ step: "login_success", message: "Logowanie zakończone sukcesem!" });
        break;
      } catch {
        onProgress({ step: "login_failed", message: `Logowanie nieudane (próba ${attempt})` });
      }
    }

    if (!loginSuccess) {
      throw new Error("Nie udało się zalogować po 5 próbach.");
    }

    await page.waitForTimeout(2000);
    onProgress({ step: "navigating_coupons", message: "Przechodzę do strony kuponów..." });
    await page.goto("https://www.lidl.pl/prm/promotions-list", { waitUntil: "networkidle" });

    // Accept cookies if needed
    const acceptBtn = page.locator("#onetrust-accept-btn-handler");
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(2000);
    }

    onProgress({ step: "activating", message: "Rozpoczynam aktywację kuponów..." });

    let attempts = 0;
    let activatedCoupons = 0;
    const maxAttempts = 30;

    while (attempts++ < maxAttempts) {
      const btn = page
        .locator(".bg-button_primary-positive-color-background", { hasText: "AKTYWUJ" })
        .first();
      const visible = await btn.isVisible();

      if (!visible) {
        onProgress({
          step: "completed",
          message:
            `Nie znalazłem więcej przycisków AKTYWUJ. Aktywowałem ${activatedCoupons} kuponów.`,
          activatedCoupons,
        });
        break;
      }

      try {
        await btn.click({ timeout: 5000 });
        activatedCoupons++;
        onProgress({
          step: "activating",
          message: `Aktywowałem kupon ${activatedCoupons}...`,
          activatedCoupons,
        });
        await page.waitForTimeout(1000);
      } catch (e) {
        onProgress({
          step: "error",
          message: `Błąd kliknięcia: ${e}`,
          activatedCoupons,
        });
        break;
      }
    }

    return { activatedCoupons };
  } finally {
    await browser.close();
  }
}
