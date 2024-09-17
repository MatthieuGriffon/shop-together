import { useState } from "react";
import { signOut } from "next-auth/react";

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setSuccessMessage("Votre compte a été supprimé avec succès !");
        setErrorMessage("");
        setTimeout(() => {
          signOut({ callbackUrl: "/" });
        }, 2000);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la suppression du compte.");
    }
  };

  return (
    <div className="space-y-4 flex flex-col align-middle mt-2">
      {/* Bouton pour afficher/masquer la confirmation */}
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)} // Inverser l'état pour afficher le message de confirmation
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
        >
          Supprimer le compte
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-red-600 font-bold">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            irréversible.
          </p>

          <button
            onClick={handleDeleteAccount} // Appeler la fonction de suppression du compte
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
          >
            Confirmer la suppression
          </button>

          <button
            onClick={() => setShowConfirm(false)} // Masquer la confirmation si l'utilisateur annule
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
          >
            Annuler
          </button>
        </div>
      )}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </div>
  );
}
