import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
        }),
        
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {
                const { email, password } = credentials;

                const res = await fetch(`http://localhost:5000/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },

                    body: JSON.stringify({ email, password })
                });

                const user = await res.json();
                
                if (res.ok && user) {
                    return user;
                    
                } else return null;
            },
        }),
    ],

    callbacks: {
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },

    session: "jwt"

})