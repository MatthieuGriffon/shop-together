"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { openMenu } from "../features/menuSlice";
import CreateGroupModal from "../components/CreateGroupModal";
import GroupManagementModal from "../components/GroupManagement";
import LeaveGroupModal from "../components/LeaveGroupModal";

interface Group {
  group_id: string;
  group_name: string;
  created_by: string;
  role: string;
}

interface Member {
  id: string;
  name: string;
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
  const [showLeaveGroupModal, setShowLeaveGroupModal] =
    useState<boolean>(false);
  const [selectedGroupName, setSelectedGroupName] = useState<string | null>(
    null
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [groupMembers, setGroupMembers] = useState<Member[]>([]);

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

      setGroups(data.message === "Aucun groupe trouvé" ? [] : data);
    } catch (error) {
      setError(
        (error as Error).message || "Erreur lors de la récupération des groupes"
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(openMenu());
    } else if (status === "authenticated") {
      fetchGroups();
    }
  }, [status, session?.user?.id, dispatch, fetchGroups]);

  const handleCreateGroup = async (groupName: string) => {
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName, createdBy: session?.user?.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du groupe.");
      }

      fetchGroups();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrepareLeaveGroup = async (groupId: string) => {
    try {
      const res = await fetch(
        `/api/groupMembers/group/${groupId}?action=members`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des membres du groupe."
        );
      }

      if (data.message === "Aucun groupe trouvé") {
        setError("Aucun groupe trouvé.");
        return;
      }

      setGroupMembers(data);

      const isAdminUser = data.some(
        (member: Member) =>
          member.id === session?.user?.id && member.role === "admin"
      );
      setIsAdmin(isAdminUser);

      setShowLeaveGroupModal(true);
    } catch (error) {
      setError("Erreur lors de la récupération des membres du groupe.");
      console.error(error);
    }
  };

  const handleLeaveGroup = async (newAdminId?: string) => {
    console.log("Tentative de quitter le groupe avec newAdminId:", newAdminId);
    try {
      const res = await fetch(`/api/leaveGroup/${selectedGroupId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user?.id,
          newAdminId,
        }),
      });

      const data = await res.json();
      console.log("Réponse de l'API après la tentative de quitter:", data);

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la tentative de quitter le groupe."
        );
      }

      fetchGroups();
      setShowLeaveGroupModal(false);
    } catch (error) {
      setError("Erreur lors de la tentative de quitter le groupe.");
      console.error(error);
    }
  };

  const handleManageMembers = async (groupId: string) => {
    try {
      const res = await fetch(
        `/api/groupMembers/group/${groupId}?action=members`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Erreur lors de la récupération des membres."
        );
      }

      setGroupMembers(data);
      setShowGroupManagement(true);
    } catch (error) {
      console.error("Erreur:", error);
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
      {loading && (
        <p className="text-center text-gray-500">Chargement des groupes...</p>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="mt-6">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Créer un nouveau groupe
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-2">Mes groupes</h2>
        {!loading && groups.length > 0 ? (
          <ul className="space-y-4">
            {groups.map((group, index) => (
              <li
                key={group.group_id ? group.group_id : `group-${index}`}
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
                      handleManageMembers(group.group_id);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Liste et invitation des membres
                  </button>
                  <button
                    onClick={() => handlePrepareLeaveGroup(group.group_id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
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

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateGroup}
        />
      )}
      {showGroupManagement && selectedGroupId && (
        <GroupManagementModal
          groupId={selectedGroupId}
          groupName={selectedGroupName || ""}
          onClose={() => setShowGroupManagement(false)}
        />
      )}
      {showLeaveGroupModal && selectedGroupId && (
        <LeaveGroupModal
          groupName={selectedGroupName || ""}
          isAdmin={isAdmin}
          members={groupMembers}
          currentUserId={session?.user?.id || ""}
          onConfirm={handleLeaveGroup}
          onCancel={() => setShowLeaveGroupModal(false)}
        />
      )}
    </div>
  );
}
