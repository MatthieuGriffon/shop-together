import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../models/User"; // Assurez-vous que ce chemin est correct
import type { NextAuthOptions, Profile, Session as NextAuthSession } from "next-auth";

interface Session extends NextAuthSession {
  user: {
    id: string;
    name: string;
    email: string;
    profile_picture_url?: string;
    provider?: string;
  };
}
import { JWT } from "next-auth/jwt";
import { User as NextAuthUser, Account } from "next-auth"; // Import des types pour User et Account
import { AdapterUser } from "next-auth/adapters"; // Import pour AdapterUser

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 30 * 60, // Expiration après 30 minutes
    updateAge: 5 * 60, // Mise à jour toutes les 5 minutes
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
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({ where: { email: credentials.email } });

        if (!user) throw new Error("No user found with that email");

        const isPasswordValid = await bcrypt.compare(credentials.password, user.get("password") as string);
        if (!isPasswordValid) throw new Error("Invalid credentials");

        return { id: user.get("id") as string, email: user.get("email") as string, name: user.get("name") as string }; // Renvoie l'ID utilisateur, l'email et le nom
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user?: NextAuthUser | AdapterUser; // Utilisation des types NextAuthUser ou AdapterUser
      account?: Account | null; // Account peut être null
      profile?: Profile;
      isNewUser?: boolean;
    }) {
      if (user && account) {
        const oauthUser = await User.findOne({ where: { email: user.email || undefined } });

        if (!oauthUser) {
          const newUser = await User.create({
            email: user.email || "",
            name: user.name || undefined,
            oauth_provider: account.provider,
            oauth_id: account.providerAccountId,
            profile_picture_url: user.image || undefined,
          });
          token.id = newUser.getDataValue("id");
        } else {
          token.id = oauthUser.getDataValue("id");
        }

        // Ajout des informations OAuth dans le token JWT
        token.provider = account.provider || "credentials";
        token.profile_picture_url = user.image || undefined;
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = token.name as string;
      session.user.profile_picture_url = token.profile_picture_url as string | undefined;
      
      // Utilisation du provider stocké dans le token JWT
      session.user.provider = typeof token.provider === 'string' ? token.provider : "credentials";

      return session;
    },
  },
};