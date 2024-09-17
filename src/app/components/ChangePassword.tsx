import { useState } from "react";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Mot de passe mis à jour avec succès !");
        setErrorMessage("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Afficher le message de succès pendant 3 secondes avant de masquer le formulaire
        setTimeout(() => {
          setShowForm(false);
          setSuccessMessage(""); // Réinitialiser le message de succès après fermeture
        }, 3000); // 3000ms = 3 secondes
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Une erreur est survenue.");
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour du mot de passe.");
    }
  };

  return (
    <div className="space-y-4 flex flex-col align-middle">
      {/* Bouton pour afficher/masquer le formulaire */}
      <button
        onClick={() => setShowForm(!showForm)} // Inverser l'état pour afficher/masquer le formulaire
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
      >
        Changer le mot de passe
      </button>

      {showForm && ( // Si showForm est vrai, afficher le formulaire
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col space-y-4 mt-4"
        >
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}

          <div>
            <label className="block text-sm">Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="p-2 border rounded w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="p-2 border rounded w-full text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="p-2 border rounded w-full text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Valider le changement
          </button>
        </form>
      )}
    </div>
  );
}
