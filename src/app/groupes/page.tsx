"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { openMenu } from "../features/menuSlice";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupManagementModal from "../components/GroupManagement";

interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  role: string;
}

export default function GroupesPage() {
  const { status, data: session } = useSession();
  const dispatch = useAppDispatch();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showGroupManagement, setShowGroupManagement] =
    useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(openMenu());
    }
  }, [status, dispatch]);

  // Fonction pour appeler l'API et récupérer les groupes
  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = session?.user?.id; // Assurez-vous que l'utilisateur est connecté
        if (!userId) {
          setError("Impossible de récupérer l'ID utilisateur.");
          setLoading(false);
          return;
        }

        // Utilisation de la route dynamique au lieu du paramètre de requête
        const res = await fetch(`/api/groupMembers/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Erreur lors de la récupération des groupes"
          );
        }

        if (data.message === "Aucun groupe trouvé") {
          setGroups([]);
        } else {
          setGroups(data); // Les groupes sont récupérés avec succès
        }
      } catch (error) {
        setError(
          (error as Error).message ||
            "Erreur lors de la récupération des groupes"
        );
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchGroups();
    }
  }, [status, session?.user?.id]);

  const handleCreateGroup = async (groupName: string) => {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: groupName,
          createdBy: session?.user?.id, // L'ID de l'utilisateur connecté
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du groupe.");
      }

      // Appeler à nouveau l'API pour obtenir la liste mise à jour des groupes
      fetchGroups(); // Fonction qui rafraîchit la liste des groupes depuis l'API
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction existante qui appelle l'API pour récupérer les groupes
  const fetchGroups = async () => {
    setLoading(true);
    setError("");
    try {
      const userId = session?.user?.id;
      if (!userId) {
        setError("Impossible de récupérer l'ID utilisateur.");
        setLoading(false);
        return;
      }

      // Utilisation de la route dynamique
      const res = await fetch(`/api/groupMembers/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des groupes"
        );
      }

      if (data.message === "Aucun groupe trouvé") {
        setGroups([]);
      } else {
        setGroups(data); // Met à jour la liste des groupes
      }
    } catch (error) {
      setError(
        (error as Error).message || "Erreur lors de la récupération des groupes"
      );
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto p-5">
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 max-w-md mx-auto">
          <p className="text-center text-lg font-semibold text-gray-800">
            Veuillez vous connecter pour accéder à la gestion des groupes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">Gestion des groupes</h1>
      <p>Créez, rejoignez ou gérez vos groupes ici.</p>
      {/* Gestion du chargement et des erreurs */}
      {loading && (
        <p className="text-center text-gray-500">Chargement des groupes...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {/* Section pour la création de groupe */}
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)} // Ouvrir la modal
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Créer un nouveau groupe
        </button>
      </div>
      {/* Section pour rejoindre un groupe */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Rejoindre un groupe</h2>
        <input
          type="text"
          placeholder="Entrez un code d'invitation"
          className="border p-2 w-full"
        />
        <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded">
          Rejoindre
        </button>
      </div>
      {/* Liste des groupes */}{" "}
      {/* Section pour afficher la liste des groupes de l'utilisateur */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Mes groupes</h2>
        {!loading && groups.length > 0 ? (
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.group_id} // Ajout de la clé ici
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold text-black">
                  {group.group_name}
                </h3>
                <p className="text-black">
                  Rôle: {group.role === "admin" ? "Administrateur" : "Membre"}
                </p>
                <p className="text-sm text-black">
                  Créé par : {group.created_by}
                </p>
                <div className="mt-2 flex space-x-4">
                  <button
                    onClick={() => {
                      setSelectedGroupName(group.group_name);
                      setSelectedGroupId(group.group_id);
                      setShowGroupManagement(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Gérer les membres
                  </button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded">
                    Quitter le groupe
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          !loading && (
            <p className="text-center text-gray-600">Aucun groupe trouvé.</p>
          )
        )}
      </div>
      {/* Modal de création de groupe */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)} // Fermer la modal
          onSubmit={handleCreateGroup} // Fonction pour soumettre le formulaire
        />
      )}
      {showGroupManagement && selectedGroupId && (
        <GroupManagementModal
          groupId={selectedGroupId}
          groupName={selectedGroupName || ""}
          onClose={() => setShowGroupManagement(false)}
        />
      )}
    </div>
  );
}
