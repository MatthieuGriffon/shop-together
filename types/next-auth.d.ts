import { DefaultSession } from "next-auth";

// Étendre les types de NextAuth
declare module "next-auth" {

  interface User {
    profile_picture_url?: string; // Ajout de la photo de profil pour l'utilisateur
  }

  interface Session {
    user: {
      id: string; 
      name: string;
      email: string;
      profile_picture_url?: string; // Photo de profil personnalisée
      image?: string | null; // Image provenant des fournisseurs OAuth
      updated_at?: string;
      provider?: string;  // Date de mise à jour
    } & DefaultSession["user"]; // Garde les autres propriétés (email, name, etc.)
  }

  interface JWT {
    profile_picture_url?: string; // Inclure profile_picture_url dans le token JWT
    provider?: string; // Ajoute le fournisseur OAuth dans le token JWT
  }
}
