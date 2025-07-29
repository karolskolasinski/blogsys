"use server";

import { db } from "@/lib/db";
import { Account } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

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

export async function fetchAccounts(): Promise<Array<{ login: string; password: string }>> {
  const session = await auth();
  const userId = session?.user?.id;

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
