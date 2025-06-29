import type { NextAuthOptions } from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import LinkedIn from "next-auth/providers/linkedin"

// Create an array to hold our configured providers
const configuredProviders = []

// Only add Google provider if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  configuredProviders.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  )
}

// Only add GitHub provider if credentials exist
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  configuredProviders.push(
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  )
}

// Only add LinkedIn provider if credentials exist
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  configuredProviders.push(
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "r_liteprofile r_emailaddress",
        },
      },
    }),
  )
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: configuredProviders,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider
        token.providerAccountId = account.providerAccountId
      }
      if (profile) {
        token.profile = profile
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        provider: token.provider,
        providerAccountId: token.providerAccountId,
        profile: token.profile,
      }
    },
    async signIn({ account, profile }) {
      // Allow all sign-ins for now
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    // signUp is not a valid property in NextAuth PagesOptions
    // Using newUser instead which is the correct property
    newUser: "/auth/signup",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 0, // Session expires immediately when browser is closed
  },
  secret: process.env.NEXTAUTH_SECRET || "DEVELOPMENT_SECRET_DO_NOT_USE_IN_PRODUCTION",
}
