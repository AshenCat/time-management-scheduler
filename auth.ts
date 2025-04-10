import {
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET,
} from "@/app/(config)/constants";
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const config = {
    providers: [
        GoogleProvider({
            clientId: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async session({ session, token, user }) {
            if (token) {
                session.user.id = token.google_id as string;
            }
            session.accessToken = token.accessToken;
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                console.log("account");
                console.log(account);
                token.accessToken = account.access_token;
                token.google_id = account.providerAccountId;
            }
            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
