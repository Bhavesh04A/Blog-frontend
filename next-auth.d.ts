import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}
