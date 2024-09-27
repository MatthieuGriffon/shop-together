import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const CreateNewListModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = React.useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Créer une nouvelle liste de courses
        </h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la liste"
          className="border p-2 w-full rounded mb-4 text-black"
        />
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={() => {
              onSubmit(name);
              onClose();
            }}
          >
            Créer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewListModal;
