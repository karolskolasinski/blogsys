"use server";

import { db } from "@/lib/db";
import { ActionResponse, User } from "@/types/common";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Timestamp } from "firebase-admin/firestore";
import _ from "lodash";
import { firestore } from "firebase-admin";
import DocumentSnapshot = firestore.DocumentSnapshot;
import DocumentData = firestore.DocumentData;
import WithFieldValue = firestore.WithFieldValue;
import { handleError, toBase64 } from "@/lib/utils";

export async function init(_prevState: unknown, formData: FormData): Promise<ActionResponse<void>> {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const key = formData.get("key");
    const secretKey = process.env.INIT_ADMIN_SECRET_KEY;

    if (!secretKey) {
      return handleError(null, "Błędna konfiguracja serwera");
    }

    if (key !== secretKey) {
      return handleError(null, "Brak dostępu");
    }

    if (!email || !password) {
      return handleError(null, "Email i hasło są wymagane");
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return handleError(null, "Niepoprawny format danych");
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);
    const user = {
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      name: "Admin",
      role: "admin",
      createdAt: Timestamp.now(),
      avatarId: "",
    };

    await save(user);
    return {
      success: true,
      messages: ["Utworzono nowe konto administratora"],
    };
  } catch (err) {
    return handleError(err, "Błąd inicjalizacji");
  }
}

export async function getUsers(): Promise<ActionResponse<(User | undefined)[]>> {
  const session = await auth();
  const role = session?.user?.role;
  if (role !== "admin") {
    return {
      success: false,
      messages: ["Brak dostępu"],
    };
  }

  try {
    const fields = ["name", "email", "role", "createdAt"];
    const docSnap = await db.collection("users").select(...fields).get();
    return {
      success: true,
      messages: [],
      data: docSnap.docs.map((doc) => userDocToUser(doc)),
    };
  } catch (err) {
    return {
      success: false,
      messages: [err instanceof Error ? err.message : "Błąd odczytu"],
    };
  }
}

export async function getUserByEmail(
  email: string,
  keepPass?: boolean,
): Promise<ActionResponse<User>> {
  try {
    const docSnap = await db.collection("users").where("email", "==", email).get();
    return {
      success: true,
      messages: [],
      data: userDocToUser(docSnap.docs[0], keepPass),
    };
  } catch (err) {
    return handleError(err, "Błąd odczytu");
  }
}

export async function getUserById(id: string): Promise<ActionResponse<User>> {
  try {
    const docSnap = await db.collection("users").doc(id).get();
    return {
      success: true,
      messages: [],
      data: userDocToUser(docSnap),
    };
  } catch (err) {
    return {
      success: false,
      messages: [err instanceof Error ? err.message : "Błąd odczytu"],
    };
  }
}

function userDocToUser(docSnap: DocumentSnapshot<DocumentData, DocumentData>, keepPass?: boolean) {
  if (!docSnap.exists) {
    return;
  }

  const data = keepPass ? docSnap.data() : _.omit(docSnap.data(), ["password"]);
  return {
    ...data,
    id: docSnap.id,
    createdAt: data?.createdAt?.toDate(),
  } as User;
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (session?.user?.id === id) {
    throw new Error("You cannot delete yourself");
  }
  await db.collection("users").doc(id).delete();
  redirect("/users?deleted=true");
}

export async function saveUser(_prevState: unknown, formData: FormData): Promise<ActionResponse> {
  try {
    const session = await auth();
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const file = formData.get("avatar") as File;
    const avatarChanged = formData.get("avatarChanged") as string;

    if (session?.user?.id !== id && session?.user?.role !== "admin") {
      return {
        success: false,
        messages: ["Brak uprawnień"],
      };
    }

    const user = {
      ...(id === "new" ? {} : { id }),
      name,
      email,
      ...(id === "new" && { createdAt: Timestamp.now() }),
      ...(password && { password: await bcrypt.hash(password, 10) }),
    };

    await save(user);
    if (id !== "new" && avatarChanged === "true") {
      await saveAvatar(user.id!, file);
    }

    return {
      success: true,
      messages: ["Zapisano"],
    };
  } catch (err) {
    return {
      success: false,
      messages: [err instanceof Error ? err.message : "Błąd zapisu"],
    };
  }
}

async function save(user: WithFieldValue<DocumentData>) {
  const docRef = db.collection("users");

  if (user.id) {
    const omitted = _.omit(user, ["id"]);
    await docRef.doc(user.id).update({ ...omitted });
  } else {
    const docSnap = await docRef.where("email", "==", user.email).get();
    if (!docSnap.empty) {
      throw new Error("Konto z takim adresem email już istnieje");
    }
    await docRef.add(user);
  }
}

async function saveAvatar(id: string, file: File) {
  const data = file.size > 0 ? await toBase64(file) : "";
  const userSnap = await db.collection("users").doc(id).get();
  const existingAvatarId = userSnap.exists && userSnap.data()?.avatarId
    ? (userSnap.data()!.avatarId as string)
    : "";

  if (existingAvatarId) {
    await db.collection("images").doc(existingAvatarId).update({ data });
  } else {
    const ref = await db.collection("images").add({ data });
    await db.collection("users").doc(id).update({ avatarId: ref.id });
  }
}

export async function getAvatar(avatarId: string): Promise<ActionResponse<string>> {
  if (!avatarId) {
    return {
      success: true,
      messages: [],
    };
  }

  const docSnap = await db.collection("images").doc(avatarId).get();
  if (!docSnap.exists) {
    return {
      success: false,
      messages: ["Nie znaleziono avatara"],
    };
  }

  return {
    success: true,
    messages: [],
    data: docSnap.data()?.data,
  };
}
