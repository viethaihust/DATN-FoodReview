import User from "@/models/User";
import connectMongoDB from "@/utils/db";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials: any) {
        const { email, password } = credentials;

        try {
          await connectMongoDB();
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Password does not match");
          }
          return user;
        } catch (error) {
          console.error("Error in authorization:", error);
          throw new Error("Authorization failed");
        }
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
        try {
          await connectMongoDB();
          const userExists = await User.findOne({ email });

          if (!userExists) {
            const newUser = new User({
              name: name,
              email: email,
            });
            const res = await newUser.save();
            if (res.status === 200 || res.status === 201) {
              console.log(res);
              return user;
            }
          }
        } catch (error) {
          console.error("Error calling Google API", error);
          throw new Error("Sign in failed");
        }
      }
      return user;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
