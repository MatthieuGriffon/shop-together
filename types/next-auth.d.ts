import { DefaultSession } from "next-auth";

// Étendre les types de NextAuth
declare module "next-auth" {

  interface User {
    profile_picture_url?: string;
  }
  interface Session {
    user: {
      id: string; 
      name: string;
      email: string;
      profile_picture_url?: string;
      image?: string | null;
      updated_at?: string;
    } & DefaultSession["user"]; // Garde les autres propriétés (email, name, etc.)
  }
  interface JWT {
    profile_picture_url?: string; // Inclure profile_picture_url dans le token JWT
  }
}