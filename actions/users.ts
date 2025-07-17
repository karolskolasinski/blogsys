import { db } from "@/lib/db";
import { User } from "@/types/common";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";
import _ from "lodash";
import { firestore } from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;
import WithFieldValue = firestore.WithFieldValue;

export async function init(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const key = formData.get("key");
  const secretKey = process.env.INIT_ADMIN_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Server configuration error");
  }

  if (key !== secretKey) {
    throw new Error("Unauthorized");
  }

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid input types");
  }

  const hashedPassword = await bcrypt.hash(password.trim(), 10);
  const user = {
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: "Admin",
    role: "admin",
    createdAt: Timestamp.now(),
  };

  await save(user);
  redirect("/login?initialized=true");
}

export async function getUsers() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const fields = ["name", "email", "role", "createdAt"];
  const docSnap = await db.collection("users").select(...fields).get();
  return docSnap.docs.map((doc) => userDocToUser(doc));
}

export async function getUserByEmail(email: string, keepPass?: boolean) {
  const docSnap = await db.collection("users").where("email", "==", email).get();
  return userDocToUser(docSnap.docs[0], keepPass);
}

export async function getUserById(id: string) {
  const docSnap = await db.collection("users").doc(id).get();
  return userDocToUser(docSnap);
}

function userDocToUser(docSnap: DocumentSnapshot<DocumentData, DocumentData>, keepPass?: boolean) {
  if (!docSnap.exists) {
    return null;
  }

  const data = keepPass ? docSnap.data() : _.omit(docSnap.data(), ["password"]);
  return {
    ...data,
    id: docSnap.id,
    createdAt: data?.createdAt?.toDate(),
  } as User;
}

export async function deleteUser(id: string) {
  // todo: prevent deleting yourself
  await db.collection("users").doc(id).delete();
  redirect("/users?deleted=true");
}

export async function saveUser(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const rawData = Object.fromEntries(formData.entries());
  await save({
    ...rawData,
    createdAt: Timestamp.now(),
  });

  redirect("/users?published=true");
}

async function save(user: WithFieldValue<DocumentData>) {
  const docRef = db.collection("users");

  if (user.id) {
    await docRef.doc(user.id).update(user);
  } else {
    const docSnap = await docRef.where("email", "==", user.email).get();
    if (!docSnap.empty) {
      throw new Error("User with this email already exists");
    }
    delete user.id;
    await docRef.add(user);
  }
}
