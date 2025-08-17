import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
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
        if (typeof credentials?.email !== "string" || typeof credentials?.password !== "string") {
          return null;
        }

        const res = await getUserByEmail(credentials.email, true);
        const user = res.data;
        if (!user) {
          return null;
        }

        try {
          const isValid = await bcrypt.compare(credentials.password, user.password ?? "");
          if (!isValid) {
            return null;
          }

          return _.omit(user, "password");
        } catch (err) {
          console.error("Authentication error: ", err);
          return null;
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
