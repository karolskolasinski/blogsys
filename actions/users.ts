import { db } from "@/lib/db";
import { User } from "@/types/common";
import bcrypt from "bcryptjs";

export async function getUserByEmail(email: string) {
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("email", "==", email).get();

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    return {
      ...userData as User,
      id: userDoc.id,
    };
  } catch (err) {
    console.error("Error getting user: ", err);
    return null;
  }
}

export async function init(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const key = formData.get("key");
  const secretKey = process.env.INIT_ADMIN_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing server key configuration");
  }

  if (key !== secretKey) {
    throw new Error("Unauthorized");
  }

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Invalid email or password");
  }

  try {
    const usersRef = db.collection("users");
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      email,
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    };
    const querySnapshot = await usersRef.add(user);

    return { uid: querySnapshot.id };
  } catch (err: any) {
    console.error("Error creating user: ", err);

    if (err.code === "auth/email-already-exists") {
      throw new Error("Użytkownik z takiem adresem email już istnieje");
    }

    throw new Error("Wystąpił błąd");
  }
}
