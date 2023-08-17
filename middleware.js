export { default } from "next-auth/middleware"

export const config = { 
    matcher: [
        "/app/posts",
        "/app/employer/:path*",
        "/app/worker/:path*",
    ] 
}