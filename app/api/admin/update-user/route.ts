import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { uid, email, password, displayName, role } = body;

  if (!uid) {
    return NextResponse.json({ error: "Missing UID" }, { status: 400 });
  }

  try {
    // Zaktualizuj dane użytkownika
    await adminAuth.updateUser(uid, { email, password, displayName });

    // Zaktualizuj custom claims, jeśli podano
    if (role) {
      await adminAuth.setCustomUserClaims(uid, { role });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
