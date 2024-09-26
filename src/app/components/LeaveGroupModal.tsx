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
  onConfirm: (newAdminId?: string) => void; // Passe un nouvel admin si nécessaire
  onCancel: () => void;
}
export default function LeaveGroupModal({
  groupName,
  isAdmin,
  members,
  onConfirm,
  onCancel,
}: LeaveGroupModalProps) {
  const [selectedAdminId, setSelectedAdminId] = useState<string | null>(null);

  const handleSelectAdmin = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAdminId(event.target.value);
  };

  const handleConfirm = () => {
    if (isAdmin && !selectedAdminId) {
      alert("Please select a new admin before leaving the group.");
      return;
    }
    // Appeler la fonction onConfirm avec le nouvel admin sélectionné
    onConfirm(selectedAdminId || undefined);
  };

  const otherMembers = members.filter((member) => member.role !== "admin");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl text-black font-bold mb-4">
          Quitter le groupe {groupName}
        </h2>
        <p className="text-black mb-4">
          {isAdmin
            ? `Vous êtes administrateur du groupe ${groupName}. Veuillez désigner un nouveau responsable avant de quitter.`
            : `Êtes-vous sûr de vouloir quitter le groupe ${groupName}?`}
        </p>

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
            {isAdmin ? "Confirmer et quitter" : "Quitter le groupe"}
          </button>
        </div>
      </div>
    </div>
  );
}
