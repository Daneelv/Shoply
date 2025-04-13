import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: { signIn: "/sign-in", error: "/sign-in" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        //Find user in db
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // Check if user exists and password is correct
        if (!user) return null;

        // Decrtypt DB password and compare with entered password
        const isPasswordValid = compareSync(
          credentials.password as string,
          user.password || ""
        );

        //If password is valid, return user object
        if (isPasswordValid) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        //If password is not valid, return null
        return null;
      },
    }),
  ],

  callbacks: {
    async session({ session, user, trigger, token }: any) {
      // set user id from the token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      // if there is a update then set user name
      if (trigger === "update") {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      // Assign user fields to token
      if (user) {
        token.role = user.role;

        // If user has no name then user the first part of the email
        if (user === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          // Update database to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      return token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
