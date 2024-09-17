import NextAuth, { DefaultSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      profile_picture_url?: string;
      provider?: string;
    } & DefaultSession["user"];
  }
}

import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../models/User";

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 30 * 60, // Expire après 30 minutes
    updateAge: 5 * 60, // Actualisé toutes les 5 minutes
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await User.findOne({ where: { email: credentials?.email } });
        if (!user) throw new Error("No user found with that email");

        const userPassword = user.get('password') as string;
        const userId = user.get('id') as string;
        const userEmail = user.get('email') as string;
        const valid = await bcrypt.compare(credentials?.password || "", userPassword);
        if (!valid) throw new Error("Invalid credentials");

        // Retourne les données utilisateur essentielles pour la session
        return { id: userId, email: userEmail };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user, account }) {
      // Si l'utilisateur vient de s'authentifier
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.profile_picture_url = user.profile_picture_url || null; // Ajoute la photo de profil si elle existe
      }
  
      // Assigne le provider lors de l'authentification via OAuth ou credentials
      if (account) {
        token.provider = account.provider || "credentials";
      }
  
      return token; // Retourne le token JWT modifié
    },
  
    async session({ session, token }) {
      // Transfert des propriétés du JWT vers la session
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.profile_picture_url = token.profile_picture_url as string | undefined; // Gérer les valeurs nulles
      session.user.provider = token.provider as string || "credentials"; // Assigne le provider avec "credentials" par défaut
  
      return session; // Retourne la session avec les nouvelles valeurs
    },
  }
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);