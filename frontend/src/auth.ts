import NextAuth, { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

/**
 * Users are defined by email + bcrypt-hashed password stored in env variables.
 * Passwords are NEVER stored or compared in plaintext.
 * To regenerate hashes:
 *   node -e "require('bcryptjs').hash('yourPassword', 12).then(console.log)"
 */
const users = [
  {
    id: "1",
    email: process.env.ADMIN_EMAIL || "info@mthunzitrust.org",
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
    role: "ADMIN",
  },
  {
    id: "2",
    email: process.env.EDITOR_EMAIL || "editor@mthunzi.org",
    passwordHash: process.env.EDITOR_PASSWORD_HASH || "",
    role: "EDITOR",
  },
  {
    id: "3",
    email: process.env.VIEWER_EMAIL || "viewer@mthunzi.org",
    passwordHash: process.env.VIEWER_PASSWORD_HASH || "",
    role: "VIEWER",
  },
];

export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user || !user.passwordHash) {
          return null;
        }

        // Secure bcrypt comparison — never plain-text equality
        const isValid = await bcryptjs.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function auth() {
  return getServerSession(authOptions);
}
