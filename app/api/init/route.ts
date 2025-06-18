import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, key } = body;

  const secretKey = process.env.INIT_ADMIN_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "Missing server key configuration." }, { status: 500 });
  }

  if (key !== secretKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  try {
    const user = await adminAuth.createUser({ email, password });
    await adminAuth.setCustomUserClaims(user.uid, { role: "admin" });

    return NextResponse.json({ success: true, uid: user.uid });
  } catch (error: any) {
    if (error.code === "auth/email-already-exists") {
      return NextResponse.json({ error: "Użytkownik już istnieje" }, { status: 409 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
