import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return NextResponse.rewrite(new URL("/george-seamless.html", request.url));
}

export const config = { matcher: "/" };
