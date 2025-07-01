import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl.clone();
  const path = url.pathname;
  res.headers.set("x-url", url.toString());
  res.headers.set("x-path", path);
  return res;
}
