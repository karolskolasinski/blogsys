import { db } from "@/lib/db";
import { User } from "@/types/common";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";

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

export async function getUsers() {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const fields = ["name", "email", "role", "createdAt"];
  const snapshot = await db.collection("users").select(...fields).get();
  const users: User[] = snapshot.docs.map((doc) => ({
    ...doc.data() as User,
    id: doc.id,
  }));

  return users;
}

export async function getUserByEmail(email: string) {
  const usersRef = db.collection("users");
  const querySnapshot = await usersRef.where("email", "==", email).get();

  if (querySnapshot.empty) {
    return null;
  }

  const userDoc = querySnapshot.docs[0];

  return {
    ...userDoc.data() as User,
    id: userDoc.id,
  };
}

export async function getUserById(id: string) {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }

  const userDoc = await db.collection("users").doc(id).get();
  if (!userDoc.exists) {
    return {
      id,
      name: "",
      email: "",
      role: "",
      createdAt: new Date(),
    };
  }

  return {
    ...userDoc.data(),
    id: userDoc.id,
    createdAt: userDoc.data()?.createdAt?.toDate(),
  } as User;
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
