"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAppDispatch } from "../store/hooks"; // Assurez-vous d'importer l'action dispatch
import { openMenu } from "../features/menuSlice"; // Import de l'action pour ouvrir le menu

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

  // Vérifier l'état de l'utilisateur et ouvrir le menu si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(openMenu()); // Ouvre le menu de connexion si l'utilisateur n'est pas connecté
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

        const res = await fetch(`/api/groupMembers?userId=${userId}`);
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
      fetchGroups(); // Appeler l'API lorsque l'utilisateur est authentifié
    }
  }, [status, session?.user?.id]);

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
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
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

      {/* Section pour afficher la liste des groupes de l'utilisateur */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Mes groupes</h2>
        {!loading && groups.length > 0 ? (
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.group_id}
                className="bg-gray-100 p-4 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-bold">{group.group_name}</h3>
                <p>
                  Rôle: {group.role === "admin" ? "Administrateur" : "Membre"}
                </p>
                <p className="text-sm text-gray-500">
                  Créé par : {group.created_by}
                </p>{" "}
                {/* Affichage du nom du créateur */}
                <div className="mt-2 flex space-x-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
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
    </div>
  );
}
