"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JoinGroupPage({
  params,
}: {
  params: { token: string };
}) {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>("En attente de l'action");
  const [status, setStatus] = useState<string>("loading");
  const { token } = params;

  useEffect(() => {
    const joinGroup = async () => {
      if (!token || !session?.user?.id) {
        setMessage("Token ou ID utilisateur manquant.");
        setStatus("error");
        return;
      }

      try {
        const res = await fetch("/api/joinGroup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, userId: session.user.id }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "Erreur lors de la tentative de rejoindre le groupe"
          );
        }

        if (data.message === "L'utilisateur est déjà membre du groupe.") {
          setMessage(data.message);
          setStatus("already_member");
        } else {
          setMessage("Vous avez rejoint le groupe avec succès!");
          setStatus("success");
        }
      } catch (error) {
        setMessage((error as Error).message);
        setStatus("error");
      }
    };

    if (token && session?.user?.id) {
      joinGroup();
    }
  }, [token, session?.user?.id]);

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold">Rejoindre un groupe</h1>
      <p
        className={
          status === "error"
            ? "text-red-500"
            : status === "already_member"
            ? "text-yellow-500"
            : "text-green-500"
        }
      >
        {message}
      </p>

      {/* Ajouter un lien pour rediriger vers la page des groupes */}
      {(status === "already_member" || status === "success") && (
        <div className="mt-4">
          <Link
            href="/groupes"
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          >
            Retour à la page des groupes
          </Link>
        </div>
      )}
    </div>
  );
}
