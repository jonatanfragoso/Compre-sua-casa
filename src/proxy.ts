import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, tokenValido } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  if (await tokenValido(request.cookies.get(AUTH_COOKIE)?.value)) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
