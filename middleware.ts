import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("__session")?.value;
  const loginURL = new URL("/login", req.url);

  if (!token) {
    return NextResponse.redirect(loginURL);
  }

  try {
    const response = await fetch(new URL("/api/auth/verify-token", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    return response.ok ? NextResponse.next() : NextResponse.redirect(loginURL);
  } catch {
    return NextResponse.redirect(loginURL);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
