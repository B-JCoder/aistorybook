import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/generate(.*)",
  "/admin(.*)",
  "/api/generate(.*)",
  "/api/stories(.*)",
  "/api/images(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isProtectedRoute(req) && !userId) {
    return Response.redirect(new URL("/sign-in", req.url));
  }

  // ✅ Add this to satisfy all return paths
  return NextResponse.next();
});

import { NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
      