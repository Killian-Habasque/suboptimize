import Github from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
import type { JWT } from "next-auth/jwt"
import type { Session } from "next-auth"

interface ExtendedNextAuthConfig extends NextAuthConfig {
    allowDangerousEmailAccountLinking?: boolean;
    trustHosts?: boolean;
}

export default {
    providers: [
        Github({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: Session, token: JWT }) {
            if (token.id && typeof token.id === 'string') {
                session.user.id = token.id;
            }
            if (token.role && typeof token.role === 'string') {
                session.user.role = token.role;
            }
            return session;
        },
        async signIn({ user }) {
            if (user.email === 'killian.habasque@gmail.com') {
                return true;
            }
            return true;
        }
    },
    allowDangerousEmailAccountLinking: true,
    trustHosts: true
} satisfies ExtendedNextAuthConfig