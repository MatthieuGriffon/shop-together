"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Member {
  createdAt: string | number | Date;
  User: {
    joined_at: string | number | Date;
    id: string;
    name: string;
    email: string;
  };
  role: string;
}

export default function GroupManagementModal({
  groupId,
  groupName,
  onClose,
}: {
  groupId: string;
  groupName: string;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Ajout de l'état pour vérifier si l'utilisateur est admin

  useEffect(() => {
    const fetchGroupMembers = async () => {
      setLoading(true);
      setError("");
      try {
        // Utiliser le paramètre groupId directement dans l'URL dynamique
        const res = await fetch(`/api/groupManagement/${groupId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Erreur lors de la récupération des membres."
          );
        }

        setMembers(data);

        // Vérifier si l'utilisateur connecté est un admin du groupe
        const userInGroup = data.find(
          (member: Member) => member.User.id === session?.user?.id
        );
        if (userInGroup?.role === "admin") {
          setIsAdmin(true);
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchGroupMembers();
    }
  }, [groupId, session?.user?.id]);

  const generateInviteLink = async () => {
    try {
      if (!session || !session.user) {
        setError("User not authenticated");
        return;
      }

      // Utiliser l'ID de l'utilisateur connecté
      const userId = session.user.id;

      const res = await fetch("/api/inviteMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, invitedBy: userId }), // Passer l'ID de l'utilisateur
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la génération du lien");
      }
      setInviteLink(data.link);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl text-black font-bold mb-4">
          Gestion des membres du groupe [{groupName}]
        </h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
          {members.map((member, index) => (
            <li
              key={`${member.User.id}-${index}`} // Combiner l'ID avec l'index pour garantir l'unicité
              className="bg-gray-100 p-4 text-black rounded-lg shadow-md"
            >
              <p className="font-bold text-black">{member.User.name}</p>
              <p>{member.User.email}</p>
              <p className="text-sm text-black">Rôle : {member.role}</p>
              <p className="text-xs text-black">
                Membre depuis :{" "}
                {new Date(member.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>

        {/* Afficher le bouton de génération du lien uniquement si l'utilisateur est admin */}
        {isAdmin && (
          <>
            <button
              onClick={generateInviteLink}
              className="bg-blue-500 text-white"
            >
              Générer un lien d&apos;invitation
            </button>

            {/* Affichage du lien */}
            {inviteLink && (
              <div className="mt-4">
                <p className="text-black">
                  Invitez quelqu&apos;un en partageant ce lien :
                </p>
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="border p-2 w-full text-black"
                />
                <button
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                  className="bg-gray-500 text-white mt-2"
                >
                  Copier le lien
                </button>
              </div>
            )}
          </>
        )}

        {/* Gestion des erreurs */}
        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
