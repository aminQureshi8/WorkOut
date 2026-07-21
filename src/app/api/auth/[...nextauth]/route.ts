import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import User from "../../../../../model/User";
import dbConnect from "../../../../../lib/dbConnect";
import { toEnglishDigits } from "@/utils/numbers";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { type: "text" },
        phone: { type: "text" },
        password: { type: "password" },
        username: { type: "text" },
        isOtpLogin: { type: "text" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const rawIdentifier = credentials?.phone || credentials?.email;
          if (!rawIdentifier) return null;

          const cleanIdentifier = toEnglishDigits(String(rawIdentifier));

          const user = await User.findOne({
            $or: [
              { phone: cleanIdentifier },
              { phone: cleanIdentifier.replace(/^0/, "") },
              { phone: `0${cleanIdentifier}` },
              { email: cleanIdentifier.toLowerCase() },
            ],
          });

          if (!user) return null;

          const isOtp = String(credentials?.isOtpLogin) === "true";
          const pwd = credentials?.password;
          const hasPassword = pwd && pwd !== "undefined" && pwd.trim() !== "";

          if (!isOtp && hasPassword) {
            const isValid = await bcrypt.compare(pwd, user.password);
            if (!isValid) return null;
          }

          return {
            id: user._id.toString(),
            email: user.email || "",
            phone: user.phone || "",
            username: user.username || "",
            role: user.role || "user",
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        await dbConnect();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            username: user.name,
            email: user.email,
            avatar: user.image,
            password: "",
          });
        }
        return true;
      }
      return true;
    },

    async jwt({ token, user }: any) {
      await dbConnect();
      const userId = user?.id || token?.id || token?.sub;
      if (userId) {
        const dbUser = await User.findById(userId);
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.avatar = dbUser.avatar;
          token.email = dbUser.email || "";
          token.phone = dbUser.phone || "";
        }
      } else if (user) {
        const dbUser = await User.findOne({
          $or: [{ phone: user.phone }, { email: user.email || token.email }],
        });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.role = dbUser.role;
          token.avatar = dbUser.avatar;
          token.email = dbUser.email || "";
          token.phone = dbUser.phone || "";
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.user.email = token.email || "";
        session.user.phone = token.phone || "";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
