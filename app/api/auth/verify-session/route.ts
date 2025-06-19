import { adminAuth } from "@/lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { session } = await req.json();
  return verify(session);
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get("__session")?.value;
  return verify(session);
}

async function verify(session: string | undefined) {
  try {
    await adminAuth.verifySessionCookie(session ?? "", true);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ ok: false }, { status: 401 });
  }
}
