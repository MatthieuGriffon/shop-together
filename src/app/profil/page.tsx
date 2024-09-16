"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppDispatch } from "../store/hooks";
import { openMenu } from "../features/menuSlice"; // Importer uniquement openMenu

const ProfilPage = () => {
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch(); // Dispatch pour ouvrir/fermer le menu

  useEffect(() => {
    if (status === "unauthenticated") {
      // Ouvrir le menu mobile en déclenchant l'action openMenu
      dispatch(openMenu());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">
          Veuillez vous connecter pour accéder à votre profil.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Profil de {session?.user?.name}
      </h1>
      <p>Email : {session?.user?.email}</p>
      {/* Ajouter d'autres informations utilisateur ici */}
    </div>
  );
};

export default ProfilPage;
