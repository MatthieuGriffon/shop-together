"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import CreateNewListModal from "../components/CreateNewListModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal"; // Import de la modal de confirmation
import { X } from "lucide-react"; // Importer la croix de Lucide React

interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  role: string;
  lists?: ShoppingList[];
}

interface ShoppingList {
  id: string;
  name: string;
  creator: { name: string };
  items: ListItem[];
}

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  addedBy: { name: string };
}

export default function ListeCoursesPage() {
  const { status, data: session } = useSession();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // État pour la modal de suppression
  const [listToDelete, setListToDelete] = useState<ShoppingList | null>(null); // Liste sélectionnée pour suppression

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const userId = session?.user?.id;
      if (!userId) {
        throw new Error("Impossible de récupérer l'ID utilisateur.");
      }

      const res = await fetch(`/api/groupMembers/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des groupes"
        );
      }

      const groupsWithLists = await Promise.all(
        data.map(async (group: Group) => {
          const listRes = await fetch(`/api/shoppingLists/${group.group_id}`);
          const listData = await listRes.json();

          return {
            ...group,
            lists: listData.message ? [] : listData,
          };
        })
      );

      setGroups(groupsWithLists);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchGroups();
    }
  }, [status, fetchGroups]);

  const handleCreateList = async (name: string) => {
    try {
      if (!selectedGroupId) {
        throw new Error("Groupe non sélectionné.");
      }

      const res = await fetch(`/api/shoppingLists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          groupId: selectedGroupId,
          createdBy: session?.user?.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la création de la liste."
        );
      }

      fetchGroups();
      setIsModalOpen(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteList = async () => {
    if (!listToDelete) return;

    try {
      const res = await fetch(`/api/deleteList/${listToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la suppression de la liste."
        );
      }

      fetchGroups();
      setIsDeleteModalOpen(false); // Fermer la modal après suppression
    } catch (error) {
      setError((error as Error).message);
    }
  };

  if (loading) {
    return <div className="text-center">Chargement des groupes...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Votre liste de courses partagée
      </h1>
      <p className="mb-4 text-center">
        Gérez vos articles en temps réel avec vos groupes.
      </p>

      <div className="space-y-6 text-black">
        {groups.length > 0 ? (
          groups.map((group) => (
            <div
              key={group.group_id}
              className="bg-white shadow-lg rounded-lg p-4"
            >
              <h2 className="text-lg font-semibold mb-2">{group.group_name}</h2>

              {group.lists && group.lists.length > 0 ? (
                <>
                  {group.lists.map((list) => (
                    <div
                      key={list.id}
                      className="bg-slate-600 p-3 rounded-lg shadow-sm m-1 relative"
                    >
                      {" "}
                      <button
                        onClick={() => {
                          setListToDelete(list);
                          setIsDeleteModalOpen(true);
                        }}
                        className="relative left-[96%] font-extrabold text-red-500 hover:text-red-700"
                        title="Supprimer la liste"
                      >
                        <X size={20} strokeWidth={6} />
                      </button>
                      <h3 className="text-md mb-2 text-white font-bold">
                        {list.name}
                      </h3>
                      <p className="text-sm text-white">
                        Créé par : {list.creator?.name || "Inconnu"}
                      </p>
                      <ul className="space-y-2 mt-2">
                        {list.items && list.items.length > 0 ? (
                          list.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between items-center p-2 bg-white rounded-lg"
                            >
                              <div>
                                <p className="text-md font-medium">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantité : {item.quantity}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Catégorie : {item.category}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Ajouté par : {item.addedBy?.name || "Inconnu"}
                                </p>
                              </div>
                              <input
                                type="checkbox"
                                className="form-checkbox h-5 w-5 text-green-500"
                              />
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-red-200 font-bold">
                            Aucun article trouvé.
                          </p>
                        )}
                      </ul>
                    </div>
                  ))}
                  <button
                    className="bg-green-500 text-white w-full py-2 rounded-lg mt-4"
                    onClick={() => {
                      setSelectedGroupId(group.group_id);
                      setIsModalOpen(true);
                    }}
                  >
                    Créer une nouvelle liste de courses
                  </button>
                </>
              ) : (
                <button
                  className="bg-green-500 text-white w-full py-2 rounded-lg"
                  onClick={() => {
                    setSelectedGroupId(group.group_id);
                    setIsModalOpen(true);
                  }}
                >
                  Créer une nouvelle liste de courses
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Aucun groupe trouvé.</p>
        )}
      </div>

      <CreateNewListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateList}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteList}
        listName={listToDelete?.name || ""}
      />
    </div>
  );
}
