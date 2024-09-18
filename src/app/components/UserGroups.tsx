import { useEffect, useState } from "react";

// Définir l'interface pour un groupe
interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  role: string;
}

export default function UserGroups({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUserGroups = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(`/api/groupMembers?userId=${userId}`);
        if (res.ok) {
          const data: Group[] = await res.json();
          setGroups(data);
        } else {
          const errorData = await res.json();
          setError(errorData.message || "Une erreur est survenue.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des groupes.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGroups();
  }, [userId]);

  return (
    <div className="flex flex-col items-center justify-start mt-4 p-4 space-y-4">
      <h1 className="text-lg font-bold">Mes Groupes</h1>

      {/* Gestion du chargement */}
      {loading && <p className="text-gray-500">Chargement des groupes...</p>}

      {/* Affichage des erreurs */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Liste des groupes ou message "aucun groupe" */}
      {!loading && !error && (
        <>
          {groups.length > 0 ? (
            <ul className="w-full space-y-4 overflow-y-auto max-h-64 md:max-h-96">
              {groups.map((group) => (
                <li
                  key={group.group_id}
                  className="bg-white border rounded-lg p-4 shadow-md"
                >
                  <div className="text-base font-bold text-gray-800">
                    {group.group_name}
                  </div>
                  <div className="text-sm text-gray-600">
                    Rôle : {group.role === "admin" ? "Créateur" : "Membre"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {group.role === "admin"
                      ? "Vous avez créé ce groupe."
                      : "Créé par : " + group.created_by}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-center text-gray-600 bg-gray-100 p-6 border border-gray-300 rounded-lg shadow-md">
              Vous n&rsquo;êtes membre d&rsquo;aucun groupe.
            </p>
          )}
        </>
      )}
    </div>
  );
}
