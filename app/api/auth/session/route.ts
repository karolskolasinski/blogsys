import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: Request) {
  const { token } = await req.json();
  const expiresIn = 1000 * 60 * 60 * 24 * 14;
  const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn });
  const response = NextResponse.json({ ok: true });

  response.cookies.set("__session", sessionCookie, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: expiresIn,
  });

  return response;
}
