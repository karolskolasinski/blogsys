import { db } from "@/lib/db";
import { User } from "@/types/common";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

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

  const user: User = {
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    name: "Admin",
    role: "admin",
  };

  await usersRef.add(user);
  redirect("/login?initialized=true");
}
