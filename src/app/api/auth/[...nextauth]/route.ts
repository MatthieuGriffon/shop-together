import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ account, profile }) {
      console.log("Account:", account);
      console.log("Profile:", profile);

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
          // Forcer la mise à jour, même s'il n'y a pas de changement
          await existingUser.update(
            {
              oauth_id: account.providerAccountId,
              oauth_provider: account.provider,
              updated_at: new Date()  // Forcer la mise à jour de la date
            },
            { fields: ['oauth_id', 'oauth_provider', 'updated_at'] }
          );
        }

        return true; // Autoriser la connexion
      } catch (error) {
        console.error("Erreur lors de la connexion de l'utilisateur OAuth :", error);
        return false; // Bloquer la connexion en cas d'erreur
      }
    }
  }
});

export { handler as GET, handler as POST };
