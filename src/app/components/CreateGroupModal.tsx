import { useState } from "react";

interface CreateGroupModalProps {
  onClose: () => void;
  onSubmit: (groupName: string) => Promise<void>;
}

export default function CreateGroupModal({
  onClose,
  onSubmit,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName) {
      setFormError("Le nom du groupe est requis.");
      return;
    }

    try {
      await onSubmit(groupName);
      setGroupName("");
      onClose();
    } catch (error) {
      setFormError("Erreur lors de la création du groupe.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Créer un nouveau groupe
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom du groupe"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 w-full mb-4 text-black"
          />
          {formError && <p className="text-red-500">{formError}</p>}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
