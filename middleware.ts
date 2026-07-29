import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = [
    "/dashboard-agence",
    "/mon-espace",
    "/deposer-annonce",
    "/admin",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard-agence/:path*",
    "/mon-espace/:path*",
    "/deposer-annonce/:path*",
    "/admin/:path*",
  ],
};