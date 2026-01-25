// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   if (path.startsWith("/admin")) {
//     const token = request.cookies.get("adminToken")?.value;

//     if (!token) {
//       // return NextResponse.redirect(new URL("/admin/login", request.url));
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//         isAdmin: boolean;
//       };

//       if (!decoded.isAdmin) {
//         // return NextResponse.redirect(new URL("/admin/login", request.url));
//       }
//     } catch (error) {
//       // return NextResponse.redirect(new URL("/admin/login", request.url));
//     }
//   }
//   return NextResponse.next();
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      // Comment this out for testing
      console.log("No token");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      const isAdmin = (decoded as any).isAdmin;
      if (!isAdmin) {
        console.log("Invalid token, but allowing access for testing.");
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    } catch (error) {
      console.log("Token verification error:", error);
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}
