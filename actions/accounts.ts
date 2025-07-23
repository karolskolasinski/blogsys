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

async function activateCouponsForAccount(login: string, password: string): Promise<void> {
  const browser = await puppeteer.launch({ headless: false, slowMo: 35 });
  const page = await browser.newPage();

  // Set viewport to larger size
  await page.setViewport({ width: 1366, height: 1279 });
  // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

  await delay(5000);
  await page.goto(
    "https://accounts.lidl.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fcountry_code%3DPL%26response_type%3Dcode%26client_id%3DPolandEcommerceClient%26scope%3Dopenid%2520profile%2520Lidl.Authentication%2520offline_access%26state%3DuRioL0R5OK8_m-_IlXsZUw5itESRUve98eNlcILTI0U%253D%26redirect_uri%3Dhttps%253A%252F%252Fwww.lidl.pl%252Fuser-api%252Fsignin-oidc%26nonce%3DIPW5u0jBWJXBOuuFncA361AuMLi0NTdt7NQ3E95fEPU%26step%3Dlogin%26language%3Dpl-PL#login",
    { waitUntil: "networkidle2" },
  );
  await page.type('input[name="input-email"]', login);
  await page.type('input[name="Password"]', password);
  await Promise.all([
    page.click('button[data-submit="true"]'),
    page.waitForNavigation({ waitUntil: "networkidle2" }),
  ]);

  await page.goto("https://www.lidl.pl/prm/promotions-list", { waitUntil: "networkidle2" });

  const buttons = await page.$$("button.bg-button_primary-positive-color-background");
  console.log(`Found ${buttons.length} buttons`);

  if (buttons.length > 0) {
    const text = await buttons[0].evaluate((el) => el?.textContent?.trim());
    if (text?.includes("AKTYWUJ")) {
      console.log("Clicking first button...");
      buttons[0].click();
      await delay(300);
    }
  } else {
    console.log('No buttons found with role="button"');
  }

  // for (const btn of buttons) {
  //   try {
  //     await btn.click();
  //     await delay(300);
  //   } catch (err) {
  //     console.error(err, "=======================");
  //     // ignoruj błędy pojedynczych kliknięć
  //   }
  // }

  // await page.goto("https://www.lidl.pl/logout", { waitUntil: "networkidle2" });
  // await browser.close();
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
