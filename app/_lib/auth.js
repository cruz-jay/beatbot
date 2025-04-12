import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Spotify from "next-auth/providers/spotify";
import Github from "next-auth/providers/github";
import { getUser, createUser } from "./data";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Spotify({
      clientId: process.env.AUTH_SPOTIFY_ID,
      clientSecret: process.env.AUTH_SPOTIFY_SECRET,
    }),
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
    async signIn({ user, account, profile }) {
      try {
        const existingUser = await getUser(user.email);

        if (!existingUser) {
          await createUser({
            email: user.email,
            fullName: user.name,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          });
        } else {
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    async session({ session }) {
      try {
        const userData = await getUser(session.user.email);
        if (userData) {
          session.user.userId = userData.id;
          session.user.provider = userData.provider;
        }
        return session;
      } catch (error) {
        return session;
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
