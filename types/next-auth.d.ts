// types/next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    // add any other custom user fields here if used
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
