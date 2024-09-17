"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch } from "../store/hooks";
import { openMenu } from "../features/menuSlice";
import Image from "next/image";
import defaultProfilePic from "/public/images/default-profile.png";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

interface UserDataWithProfilePicture {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  createdAt: string;
  updated_at?: string;
}

const ProfilPage = ({
  userData: initialUserData,
}: {
  userData: UserDataWithProfilePicture;
}) => {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [userData, setUserData] =
    useState<UserDataWithProfilePicture>(initialUserData);
  const dispatch = useAppDispatch();
  const [imageLoading, setImageLoading] = useState(true);

  // Fonction pour gérer la sélection de l'image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Prévisualisation de l'image
    }
  };

  // Fonction pour soumettre l'image
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("userId", session?.user?.id || ""); // Récupérer l'ID de session

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      console.log("Image uploaded successfully");
      fetchUserData(); // Re-fetch user data after uploading the image
    } else {
      console.error("Failed to upload image");
    }
  };

  // Fonction pour récupérer les données utilisateur
  const fetchUserData = useCallback(async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch(`/api/user/${session.user.id}`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");

        const data = await response.json();
        setUserData({
          id: data.id,
          name: data.name,
          email: data.email,
          profilePictureUrl: data.profilePictureUrl,
          createdAt: data.createdAt,
          updated_at: data.updated_at,
        });
        console.log("Données utilisateur récupérées : ", data);
        setImageLoading(false); // L'image est chargée après la récupération des données utilisateur
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données utilisateur",
          error
        );
      }
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      dispatch(openMenu());
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, session?.user?.id, dispatch, fetchUserData]);

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

  // Utiliser l'image de profil OAuth si disponible, sinon l'image uploadée
  const profilePictureUrl =
    session?.user?.image ||
    previewImage ||
    userData?.profilePictureUrl ||
    defaultProfilePic.src;

  const isCredentialUser = session?.user?.provider === "credentials";

  return (
    <div className="p-2 max-w-xs mx-auto">
      <h1 className="text-xl font-semibold text-center mb-2">
        Profil de {userData?.name}
      </h1>

      {/* Afficher l'image uniquement quand elle est prête */}
      <div
        className={`rounded-full mx-auto flex flex-col items-center ${
          imageLoading ? "hidden" : "block"
        }`}
      >
        <Image
          src={profilePictureUrl}
          alt={`Photo de profil de ${userData?.name}`}
          width={64}
          height={64}
          className="rounded-full"
          priority={true}
          onLoad={() => setImageLoading(false)}
          blurDataURL={defaultProfilePic.src}
        />
      </div>

      {imageLoading && (
        <p className="text-center text-gray-500">
          Chargement de l&apos;image...
        </p>
      )}

      {/* Afficher le formulaire d'upload uniquement si l'utilisateur n'a pas d'image OAuth */}
      {!session?.user?.image && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-2 mt-4"
        >
          {/* Remplacer l'input file par un label personnalisé */}
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sélectionner une image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Valider votre photo de profil
          </button>
        </form>
      )}

      <p className="text-sm text-center text-gray-700 mt-4">
        Email : {userData?.email}
      </p>
      {userData?.createdAt && (
        <p className="text-sm text-center text-white">
          Inscrit depuis : {new Date(userData.createdAt).toLocaleDateString()}
        </p>
      )}
      {userData?.updated_at && (
        <p className="text-sm text-center text-white">
          Dernière connexion :{" "}
          {new Date(userData.updated_at).toLocaleDateString()} à{" "}
          {new Date(userData.updated_at).toLocaleTimeString()}
        </p>
      )}
      {isCredentialUser && (
        <div className="mt-6">
          <ChangePassword />
        </div>
      )}
      <div className="mt-6">
        <DeleteAccount />
      </div>
    </div>
  );
};

export default ProfilPage;
