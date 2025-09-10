import { NextRequest, NextResponse } from "next/server";
import { Routes } from "./types/note";
import { cookies } from "next/headers";
import { checkServerSession } from "./lib/serverApi";
import { parse } from "cookie";

const publicRoutes = ["/sign-in", "/sign-up"];
const privateRoutes = ["/notes", "/profile"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (!accessToken) {
    if (refreshToken) {
      const response = await checkServerSession();
      const setCookie = response.headers["set-cookie"];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookie of cookieArray) {
          const parsed = parse(cookie);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: Number(parsed["Max-Age"]),
          };
          if (parsed.accessToken) {
            cookieStore.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken) {
            cookieStore.set("refreshToken", parsed.refreshToken, options);
          }
        }
        if (isPublicRoute) {
          return NextResponse.redirect(Routes.Home, {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }
    if (isPublicRoute) {
      return NextResponse.next();
    }
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL(Routes.SignIn, request.url));
    }
  }
  if (isPublicRoute) {
    return NextResponse.redirect(new URL(Routes.Home, request.url));
  }
  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/profile",
    "/profile/edit",
    "/notes/:path",
    "/notes/action/:action",
    "/notes/filter/:filter",
    "/sign-in",
    "/sign-up",
  ],
};
