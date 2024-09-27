"use client";

import { useState } from "react";

interface Member {
  id: string;
  name: string;
  role: string;
}

interface LeaveGroupModalProps {
  groupName: string;
  isAdmin: boolean;
  members: Member[];
  currentUserId: string; // L'ID de l'utilisateur actuel
  onConfirm: (newAdminId?: string) => void;
  onCancel: () => void;
}

export default function LeaveGroupModal({
  groupName,
  isAdmin,
  members,
  currentUserId,
  onConfirm,
  onCancel,
}: LeaveGroupModalProps) {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  // Exclure l'utilisateur actuel de la liste des membres disponibles pour devenir admin
  const otherMembers = members.filter((member) => {
    return member.id !== currentUserId;
  });

  const handleSelectAdmin = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdminId(event.target.value);
  };

  const handleConfirm = () => {
    // Vérifier si un nouvel administrateur doit être désigné
    if (isAdmin && !selectedAdminId && otherMembers.length > 0) {
      alert("Veuillez sélectionner un nouveau responsable avant de quitter.");
      return;
    }

    // Appeler la fonction onConfirm avec le nouvel admin sélectionné (si applicable)
    onConfirm(selectedAdminId || undefined);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl text-black font-bold mb-4">
          Quitter le groupe {groupName}
        </h2>

        {/* Si l'utilisateur est seul dans le groupe */}
        {isAdmin && otherMembers.length === 0 ? (
          <p className="text-black mb-4">
            Vous êtes le seul membre du groupe. Si vous quittez, le groupe sera
            supprimé.
          </p>
        ) : (
          <>
            <p className="text-black mb-4">
              Vous êtes administrateur du groupe {groupName}. Veuillez désigner
              un nouveau responsable avant de quitter.
            </p>

            {/* Si l'utilisateur est admin et qu'il y a d'autres membres */}
            {isAdmin && otherMembers.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">
                  Sélectionner un nouveau responsable
                </label>
                <select
                  onChange={handleSelectAdmin}
                  className="block w-full border rounded-lg p-2 text-black"
                >
                  <option value="">Choisir un membre</option>
                  {otherMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {isAdmin && otherMembers.length > 0
              ? "Confirmer et quitter"
              : "Quitter le groupe"}
          </button>
        </div>
      </div>
    </div>
  );
}
