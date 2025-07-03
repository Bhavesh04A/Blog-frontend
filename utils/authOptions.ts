import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions, SessionStrategy } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === "admin" &&
          credentials?.password === "admin123"
        ) {
          return { id: "1", name: "Admin User", isAdmin: true };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
        if (!session.user) {
        session.user = {};
        }
        if (typeof token.isAdmin === "boolean") {
        session.user.isAdmin = token.isAdmin;
        } else {
        session.user.isAdmin = false; // or undefined, as needed
        }
        return session;
    },
    async jwt({ token, user }) {
        if (user) token.isAdmin = user.isAdmin;
        return token;
    },
  },

  session: {
    strategy: "jwt" as SessionStrategy,
  },
};
