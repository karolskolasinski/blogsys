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

  const usersRef = db.collection("users");
  const [userSnapshot, hashedPassword] = await Promise.all([
    usersRef.where("email", "==", email).get(),
    bcrypt.hash(password.trim(), 10),
  ]);

  if (!userSnapshot.empty) {
    throw new Error("User with this email already exists");
  }

  const user = {
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: "Admin",
    role: "admin",
    createdAt: Timestamp.now(),
  };

  await usersRef.add(user);
  redirect("/login?initialized=true");
}

function userDocToUser(snapshot: DocumentSnapshot<DocumentData, DocumentData>) {
  if (!snapshot.exists) {
    return null;
  }

  const data = _.omit(snapshot.data(), ["password"]);
  return {
    ...data,
    id: snapshot.id,
    createdAt: data?.createdAt?.toDate(),
  } as User;
}

export async function getUsers() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const fields = ["name", "email", "role", "createdAt"];
  const snapshot = await db.collection("users").select(...fields).get();
  return snapshot.docs.map((doc) => userDocToUser(doc));
}

export async function getUserByEmail(email: string) {
  const snapshot = await db.collection("users").where("email", "==", email).get();
  return userDocToUser(snapshot.docs[0]);
}

export async function getUserById(id: string) {
  const snapshot = await db.collection("users").doc(id).get();
  return userDocToUser(snapshot);
}

export async function deleteUser(id: string) {
  await db.collection("users").doc(id).delete();
  redirect("/users?deleted=true");
}

export async function saveUser(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string).trim();

  const data = {
    name,
  };

  if (id === "new") {
    await db.collection("users").add(data);
  } else {
    await db.collection("users").doc(id).update(data);
  }

  redirect("/users?published=true");
}
