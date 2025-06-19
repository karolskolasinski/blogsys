import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  const response = NextResponse.json({ ok: true });

  response.cookies.set("__session", token, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  return response;
}
