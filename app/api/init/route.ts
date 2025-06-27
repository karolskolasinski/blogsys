import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import bcrypt from "bcryptjs";
import { User } from "@/types/common";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, key } = body;

  const secretKey = process.env.INIT_ADMIN_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Missing server key configuration" }, { status: 500 });
  }

  if (key !== secretKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
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

    return NextResponse.json({ success: true, uid: querySnapshot.id });
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Użytkownik już istnieje" }, { status: 409 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
