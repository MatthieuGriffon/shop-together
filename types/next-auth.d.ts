import { DefaultSession } from "next-auth";

// Étendre les types de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Ajoute l'ID utilisateur à la session
    } & DefaultSession["user"]; // Garde les autres propriétés (email, name, etc.)
  }
}