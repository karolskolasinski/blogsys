import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export async function GET() {
  const adminLogin = process.env.INITIAL_ADMIN_LOGIN;
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;

  if (!adminLogin || !adminPassword) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 500 });
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", adminLogin));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    await addDoc(usersRef, {
      login: adminLogin,
      password: adminPassword,
      role: "admin",
      createdAt: Date.now(),
    });

    return NextResponse.json({ created: true });
  }

  return NextResponse.json({ created: false });
}
