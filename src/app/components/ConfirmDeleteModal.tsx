import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  listName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  listName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
        <p className="mb-4">
          Êtes-vous sûr de vouloir supprimer la liste &quot;{listName}&quot; ?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
