// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/add-new(.*)",
  "/websites(.*)",
  "/validator(.*)",
]);

const middleware = clerkMiddleware(async (auth, req: NextRequest) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      // Redirect unauthenticated users to sign-in page
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Allow access to everything else (e.g., /api, /, etc.)
  return NextResponse.next();
});

export default middleware;

export const config = {
  matcher: [
    /**
     * Apply middleware to all paths EXCEPT:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
