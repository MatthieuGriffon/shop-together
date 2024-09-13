import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "../../../models/User";

const handler = NextAuth({
  session: {
    maxAge: 30 * 60, // La session expire après 30 minutes d'inactivité
    updateAge: 5 * 60, // Le token est actualisé toutes les 5 minutes d'activité
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 60,
      },
    },
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
    email: { label: "Email", type: "text", placeholder: "email@example.com" },
    password: { label: "Password", type: "password" },
    name: { label: "Name", type: "text", placeholder: "John Doe" },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      console.log("Email ou mot de passe manquant");
      throw new Error("Email and password must be provided.");
    }
  
    try {
      console.log("Tentative de connexion avec l'email :", credentials.email);
      const user = await User.findOne({
        where: { email: credentials?.email },
      });
  
      if (!user) {
        console.log("Utilisateur non trouvé pour l'email :", credentials.email);
        throw new Error("No user found with the provided email.");
      }
  
      const userData = user.get({ plain: true });
      if (!userData.password) {
        console.log("Aucun mot de passe pour cet utilisateur :", userData);
        throw new Error("This account does not have a password set.");
      }
  
      const isValid = await bcrypt.compare(credentials.password, userData.password);
      if (!isValid) {
        console.log("Mot de passe incorrect pour l'email :", credentials.email);
        throw new Error("Invalid password.");
      }
  
      console.log("Connexion réussie pour l'utilisateur :", userData);
      return { id: userData.id, email: userData.email, name: userData.name };
    } catch (error) {
      console.error("Erreur lors de l'authentification :", error);
      return null;
    }
  }
})
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      // Gestion des connexions OAuth (Google, Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!profile || !account || !profile.email) {
          return false; // Bloquer la connexion si les informations sont manquantes
        }
    
        const { email, name } = profile;
    
        try {
          const existingUser = await User.findOne({
            where: { email },
          });
    
          if (!existingUser) {
            // Si l'utilisateur n'existe pas, crée une nouvelle entrée dans la table users
            await User.create({
              name: name || "Nom inconnu",
              email,
              oauth_provider: account.provider,
              oauth_id: account.providerAccountId,
            });
          } else {
            // Mise à jour de l'utilisateur existant avec les informations OAuth
            await existingUser.update(
              {
                oauth_id: account.providerAccountId,
                oauth_provider: account.provider,
                updated_at: new Date(),
              },
              { fields: ['oauth_id', 'oauth_provider', 'updated_at'] }
            );
          }
    
          return true; // Autoriser la connexion via OAuth
        } catch (error) {
          console.error("Erreur lors de la connexion de l'utilisateur OAuth :", error);
          return false;
        }
      }
    
      // Pour les credentials, ne pas interférer
      return true; // Toujours autoriser les credentials car ils sont déjà validés dans authorize
    },
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT Callback - User : ", user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      console.log("JWT Callback - Token : ", token);
      return token;
    },
    
    async session({ session, token }) {
      console.log("Session Callback - Token : ", token);
      console.log("Session Callback - Session : ", session);
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.email) {
        session.user.email = token.email;
      }
      if (token?.name) {
        session.user.name = token.name;
      }
      return session;
    }
    
    ,
    
  },
});

export { handler as GET, handler as POST };
