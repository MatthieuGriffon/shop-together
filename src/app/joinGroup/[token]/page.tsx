"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function JoinGroupPage({
  params,
}: {
  params: { token: string };
}) {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("En attente de l'action");
  const { token } = params; // Récupération du token directement depuis l'URL

  useEffect(() => {
    const joinGroup = async () => {
      if (!token || !session?.user?.id) {
        setMessage("Token ou ID utilisateur manquant.");
        return;
      }

      try {
        const res = await fetch("/api/joinGroup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId: session.user.id }), // Utilisation de l'ID de l'utilisateur connecté
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "Erreur lors de la tentative de rejoindre le groupe"
          );
        }

        setMessage("Vous avez rejoint le groupe avec succès.");
      } catch (error) {
        setMessage((error as Error).message);
      }
    };

    if (token && session?.user?.id) {
      joinGroup(); // Appel à l'API seulement si le token et l'utilisateur sont présents
    }
  }, [token, session?.user?.id]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Rejoindre un groupe</h1>
      <p>{message}</p>
    </div>
  );
}
