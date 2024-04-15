// export { default } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const verified = req.nextauth.token?.user.completedProfile;
    const url =
      req.nextauth.token?.user.userType === "household employer"
        ? `${process.env.NEXT_PUBLIC_KASAMBAHAYKO_URL}/app/employer/complete-profile`
        : `${process.env.NEXT_PUBLIC_KASAMBAHAYKO_URL}/app/worker/complete-profile`;

    if (!verified && !req.nextUrl.pathname.includes("complete-profile")) {
      return NextResponse.redirect(url);
    }
  },
  {
    callbacks: {
      authorized: (params) => {
        let { token } = params;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/app/posts/:path*", "/app/employer/:path*", "/app/worker/:path*"],
};
