import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from '@/lib/mongodb';
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔵 Authorize called with:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.log("🔴 Missing credentials");
          return null;
        }

        try {
          await connectDB();
          console.log("🟢 DB Connected");
        } catch (error) {
          console.error("🔴 DB Connection failed:", error);
          return null;
        }

        const userFound = await User.findOne({ email: credentials.email });

        if (!userFound) {
          console.log("🔴 User not found:", credentials.email);
          return null;
        }

        console.log("🟢 User found:", userFound.email);

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          userFound.password
        );

        if (!passwordMatch) {
          console.log("🔴 Password mismatch for:", credentials.email);
          return null;
        }

        console.log("🟢 Password verified. Returning user.");
        return {
          id: userFound._id.toString(),
          name: userFound.name,
          email: userFound.email,
          role: userFound.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
