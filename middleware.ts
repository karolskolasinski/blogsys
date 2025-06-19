import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("__session")?.value;
  const loginURL = new URL("/login", req.url);

  if (!session) {
    return NextResponse.redirect(loginURL);
  }

  try {
    const response = await fetch(new URL("/api/auth/verify-session", req.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session }),
    });

    return response.ok ? NextResponse.next() : NextResponse.redirect(loginURL);
  } catch (err) {
    console.log(err);
    return NextResponse.redirect(loginURL);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
