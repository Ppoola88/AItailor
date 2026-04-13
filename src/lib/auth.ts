import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { logger } from "@/lib/logger";
import { loginSchema } from "@/lib/validation/auth";
import { verifyCredentials } from "@/services/auth-service";

const authSecret =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV !== "production" ? "anjarpanam-local-dev-secret" : undefined);

const isDevelopment = process.env.NODE_ENV !== "production";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: authSecret,
  pages: {
    signIn: "/login",
  },
  cookies: isDevelopment
    ? {
        sessionToken: {
          name: "anjarpanam.dev-session-token",
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            secure: false,
          },
        },
      }
    : undefined,
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        try {
          return await verifyCredentials(parsed.data);
        } catch (error) {
          logger.error("Credentials authorization failed", {
            error: error instanceof Error ? error.message : "Unknown auth error",
          });
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export async function auth() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    logger.warn("Auth session resolution failed; returning anonymous session", {
      error: error instanceof Error ? error.message : "Unknown auth session error",
    });
    return null;
  }
}
