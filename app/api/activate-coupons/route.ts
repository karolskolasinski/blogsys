import { fetchAccounts } from "@/actions/accounts";
import { chromium } from "playwright";

export async function POST() {
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
            const result = await activateCouponsForAccountWithProgress(
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

async function activateCouponsForAccountWithProgress(
  login: string,
  password: string,
  onProgress: (progress: any) => void,
) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.setViewportSize({ width: 1366, height: 1279 });

    onProgress({ step: "navigating", message: "Navigating to login page..." });
    await page.goto("https://www.lidl.pl/mla/", { waitUntil: "load" });
    await page.waitForURL((url) => url.hostname.includes("accounts.lidl.com"));

    onProgress({ step: "logging_in", message: "Logging in..." });
    await page.waitForSelector('input[name="input-email"]');
    await page.fill('input[name="input-email"]', login);
    await page.fill('input[name="Password"]', password);
    await page.click('button[data-submit="true"]');
    await page.waitForTimeout(3000);

    onProgress({ step: "navigating_coupons", message: "Navigating to coupons page..." });
    await page.goto("https://www.lidl.pl/prm/promotions-list", { waitUntil: "load" });
    await page.waitForTimeout(3000);

    // Accept cookies if needed
    const acceptBtn = page.locator("#onetrust-accept-btn-handler");
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await page.waitForTimeout(2000);
    }

    onProgress({ step: "activating", message: "Starting coupon activation..." });

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
          message: `No more ACTIVATE buttons found. Activated ${activatedCoupons} coupons.`,
          activatedCoupons,
        });
        break;
      }

      try {
        await btn.click({ timeout: 5000 });
        activatedCoupons++;
        onProgress({
          step: "activating",
          message: `Activated coupon ${activatedCoupons}...`,
          activatedCoupons,
        });
        await page.waitForTimeout(1000);
      } catch (e) {
        onProgress({
          step: "error",
          message: `Click error: ${e}`,
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
