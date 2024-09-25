import React, { useState, useEffect } from "react";

interface LeaveGroupModalProps {
  groupName: string;
  isAdmin: boolean; // Indique si l'utilisateur est admin
  members: Array<{ id: string; name: string }>; // Liste des membres si admin
  onConfirm: (newAdminId?: string) => void; // Permet de passer un nouvel admin si nécessaire
  onCancel: () => void;
}

const LeaveGroupModal: React.FC<LeaveGroupModalProps> = ({
  groupName,
  isAdmin,
  members,
  onConfirm,
  onCancel,
}) => {
  const [selectedNewAdmin, setSelectedNewAdmin] = useState<string>("");

  useEffect(() => {
    // Si l'utilisateur est admin, on choisit par défaut le premier membre (si existant) comme nouvel admin
    if (isAdmin && members.length > 0) {
      setSelectedNewAdmin(members[0].id);
    }
  }, [isAdmin, members]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border-4 border-red-500">
        <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
          Attention !
        </h2>
        <p className="mb-4 text-lg text-gray-800 text-center">
          Êtes-vous sûr de vouloir quitter le groupe{" "}
          <strong className="text-red-500">{groupName}</strong>? <br />
          <span className="text-red-600 font-semibold">
            Cette action est irréversible.
          </span>
        </p>

        {isAdmin && members.length > 0 && (
          <div className="mb-4">
            <p className="text-center text-gray-800">
              Vous êtes l&apos;administrateur de ce groupe. Choisissez un
              nouveau membre pour assumer ce rôle avant de quitter :
            </p>
            <select
              className="w-full p-2 mt-2 border rounded"
              value={selectedNewAdmin}
              onChange={(e) => setSelectedNewAdmin(e.target.value)}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-6">
          <button
            className="bg-gray-500 text-white font-bold px-6 py-2 rounded hover:bg-gray-600 transition"
            onClick={onCancel}
          >
            Annuler
          </button>
          <button
            className="bg-red-600 text-white font-bold px-6 py-2 rounded hover:bg-red-700 transition"
            onClick={() => onConfirm(isAdmin ? selectedNewAdmin : undefined)}
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveGroupModal;
