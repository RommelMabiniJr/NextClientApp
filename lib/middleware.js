export { default } from "next-auth/middleware"

// this is being tested
export const config = {
    matcher: "/app/employer/:path*"
}