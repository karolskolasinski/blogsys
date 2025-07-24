"use server";

import { db } from "@/lib/db";
import { Account } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import puppeteer from "puppeteer";

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || "", "hex");
const ALGO = "aes-256-gcm";

export async function getAccounts() {
  const session = await auth();
  const userId = session?.user?.id;
  const query = db.collection("accounts")
    .where("ownerId", "==", userId)
    .orderBy("updatedAt", "desc");
  const docSnap = await query.get();

  return docSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      login: data.login,
      password: data.password,
      ownerId: data.ownerId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Account;
  });
}

export async function getAccount(id: string) {
  const doc = await db.collection("accounts").doc(id).get();
  if (!doc.exists) {
    return {
      id,
      ownerId: "",
      login: "",
      password: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Account;
  }

  const data = doc.data();
  return {
    id: doc.id,
    login: data?.login,
    password: data?.password,
    ownerId: data?.ownerId,
    createdAt: data?.createdAt?.toDate(),
    updatedAt: data?.updatedAt?.toDate(),
  } as Account;
}

export async function deleteAccount(id: string) {
  await db.collection("accounts").doc(id).delete();
  redirect("/accounts?deleted=true");
}

export async function saveAccount(formData: FormData) {
  const id = formData.get("id") as string;
  const login = formData.get("login") as string;
  const password = formData.get("password") as string;
  const session = await auth();
  const ownerId = session?.user?.id;

  if (!ownerId) {
    throw new Error("No owner id.");
  }

  const createdAt = id === "new"
    ? Timestamp.now()
    : Timestamp.fromDate(new Date(formData.get("createdAt") as string));

  const encrypted = encrypt(password);

  const data: Record<string, string | Timestamp> = {
    login,
    password: encrypted.data,
    iv: encrypted.iv,
    tag: encrypted.tag,
    ownerId,
    createdAt,
    updatedAt: Timestamp.now(),
  };

  if (id === "new") {
    await db.collection("accounts").add(data);
  } else {
    await db.collection("accounts").doc(id).update(data);
  }

  redirect("/accounts?published=true");
}

export async function activateCoupons() {
  const accounts = await fetchAccounts();
  for (const { login, password } of accounts) {
    try {
      await activateCouponsForAccount(login, password);
    } catch (err) {
      console.error(`Błąd dla konta ${login}:`, err);
    }
  }
}

function encrypt(text: string): { iv: string; data: string; tag: string } {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    data: encrypted.toString("hex"),
    tag: tag.toString("hex"),
  };
}

function decrypt(ivHex: string, dataHex: string, tagHex: string): string {
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const decipher = createDecipheriv(ALGO, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
}

async function fetchAccounts(): Promise<Array<{ login: string; password: string }>> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Brak zalogowanego użytkownika");

  const query = db.collection("accounts")
    .where("ownerId", "==", userId)
    .orderBy("updatedAt", "desc");
  const docs = await query.get();

  return docs.docs.map((doc) => {
    const { login, password: encryptedData, iv, tag } = doc.data();
    const decryptedPassword = decrypt(iv, encryptedData, tag);
    return { login, password: decryptedPassword };
  });
}
import { chromium } from "playwright";

export async function activateCouponsForAccount(login: string, password: string) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setViewportSize({ width: 1366, height: 1279 });
  await page.goto("https://www.lidl.pl/mla/", { waitUntil: "load" });
  await page.waitForURL((url) => url.hostname.includes("accounts.lidl.com"));
  await page.waitForSelector('input[name="input-email"]');
  await page.fill('input[name="input-email"]', login);
  await page.fill('input[name="Password"]', password);
  await page.click('button[data-submit="true"]');
  await page.waitForTimeout(3000);
  await page.goto("https://www.lidl.pl/prm/promotions-list", { waitUntil: "load" });
  await page.waitForTimeout(3000);

  const acceptBtn = page.locator("#onetrust-accept-btn-handler");
  if (await acceptBtn.isVisible()) {
    await acceptBtn.click();
    await page.waitForTimeout(2000);
  }

  let attempts = 0;
  const maxAttempts = 30;
  while (attempts++ < maxAttempts) {
    const btn = page
      .locator(".bg-button_primary-positive-color-background", { hasText: "AKTYWUJ" })
      .first();
    const visible = await btn.isVisible();

    if (!visible) {
      console.log("Brak kolejnych przycisków AKTYWUJ");
      break;
    }

    try {
      await btn.click({ timeout: 5000 });
      await page.waitForTimeout(1000);
    } catch (e) {
      console.error("Błąd kliknięcia:", e);
      break;
    }
  }

  await browser.close();
}
