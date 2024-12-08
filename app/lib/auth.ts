import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { BACKEND_URL } from "./constants";

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendTokens?.refreshToken}`,
    },
  });

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;
        const { email, password } = credentials;
        const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 401) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }
        const user = await res.json();
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === "google") {
        const { name, email } = user;
        const res = await fetch(`${BACKEND_URL}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        if (!res.ok) {
          console.error("Google login failed:", await res.text());
          return false;
        }

        const backendUser = await res.json();

        user.user = backendUser.user;
        user.backendTokens = backendUser.backendTokens;
        user.expiresIn = backendUser.expiresIn;
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };
      if (new Date().getTime() < token.backendTokens?.expiresIn) return token;
      return await refreshToken(token);
    },

    async session({ token, session }) {
      if (token) {
        session.user = token.user;
        session.backendTokens = token.backendTokens;
      }
      return session;
    },
  },
};
