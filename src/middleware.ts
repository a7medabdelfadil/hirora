// import { NextRequest, NextResponse } from "next/server";

// const publicRoutes = ["/signin", "/signup"];

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get("token")?.value;
//   console.log("token", token)

//   const isPublicRoute = publicRoutes.includes(pathname);

//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/api") ||
//     pathname === "/favicon.ico" ||
//     pathname.includes(".")
//   ) {
//     return NextResponse.next();
//   }

//   if (!token && !isPublicRoute) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
// };
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};