import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import assert from "node:assert";
import bcrypt from "bcryptjs";
import _ from "lodash";
import { getUserByEmail } from "@/actions/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        assert(typeof credentials?.email === "string", "Email is not a string");
        assert(typeof credentials?.password === "string", "Password is not a string");

        try {
          const user = await getUserByEmail(credentials.email, true);
          if (!user) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password, user.password ?? "");
          if (!isValid) {
            return null;
          }

          return _.omit(user, "password");
        } catch (error) {
          console.error("Authentication error: ", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 365,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 365,
  },
  callbacks: {
    async jwt({ token, user }) {
      // on first login user is from authorize()
      if (user) {
        return { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      const userData = _.omit(token, ["iat", "exp", "jti", "sub"]);
      return {
        ...session,
        user: { ...session.user, ...userData },
      };
    },
    redirect: async () => "/posts",
  },
});
