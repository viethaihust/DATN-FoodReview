import User from "@/models/User";
import connectMongoDB from "@/utils/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";

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

          return { id: user._id, email: user.email, name: user.name };
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
            await newUser.save();
          }
        } catch (error) {
          console.error("Error calling Google API", error);
          throw new Error("Sign in failed");
        }
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.email = token.email as string;
      session.user.name = token.name as string;

      const sessionUser = await User.findOne({ email: session.user.email });
      if (sessionUser) {
        session.user._id = sessionUser._id.toString();
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
