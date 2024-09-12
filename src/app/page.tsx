"use client"; // Indique que c'est un Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import FacebookLoginStatus from "./components/FacebookLoginStatus";

export default function Home() {
  const { data: session, status } = useSession(); // Récupère la session et le statut
  const loading = status === "loading"; // Gère l'état de chargement

  if (loading) {
    return <p>Chargement...</p>; // Afficher un état de chargement pendant que la session est récupérée
  }

  return (
    <div>
      {session ? (
        <>
          <h1>Bienvenue, {session.user?.name}</h1>
          <button onClick={() => signOut()}>Se déconnecter</button>
        </>
      ) : (
        <>
          <h1>Vous n&apos;êtes pas connecté</h1>
          <button onClick={() => signIn("google")}>
            Se connecter avec Google
          </button>
          <p>
            <button onClick={() => signIn("facebook")}>
              Login with Facebook
            </button>
            <FacebookLoginStatus />
          </p>
        </>
      )}
    </div>
  );
}
