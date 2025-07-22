"use server";

import { db } from "@/lib/db";
import { Account } from "@/types/common";
import { redirect } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";
import { auth } from "@/auth";
import { toBase64 } from "@/lib/utils";

export async function getAccounts() {
  const session = await auth(); // todo: move to save Post (if author)
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

export async function deletePost(id: string) {
  await db.collection("posts").doc(id).delete();
  redirect("/posts?deleted=true");
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

  const data: Record<string, string | string[] | Timestamp> = {
    login,
    password,
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
