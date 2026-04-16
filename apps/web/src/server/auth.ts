import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/server/db";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  // Prisma v7 generator output types can cause TS instantiation depth issues here.
  // The runtime shape is compatible; keep the cast local to auth wiring.
  adapter: PrismaAdapter(prisma as any) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findFirst({
          where: { email: parsed.data.email },
        });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nickname ?? user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.sub = user.id;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token.sub) {
        (session.user as { id: string }).id = token.sub;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

