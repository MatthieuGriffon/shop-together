import NextAuth from "next-auth";
import { authOptions } from "./authOptions"; // Import des options d'authentification

// Export des gestionnaires GET et POST pour NextAuth
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);