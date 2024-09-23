"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { openMenu } from "../features/menuSlice";
import Image from "next/image";
import defaultProfilePic from "/public/images/default-profile.png";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";
import UserGroups from "../components/UserGroups";

const ProfilPage = () => {
  const { data: session, status } = useSession();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const dispatch = useAppDispatch();

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
      // Re-fetch user data after uploading the image
    } else {
      console.error("Failed to upload image");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
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

  // Utiliser l'image de profil OAuth si disponible, sinon l'image uploadée
  const profilePictureUrl =
    session?.user?.image ||
    previewImage ||
    session?.user?.profile_picture_url ||
    defaultProfilePic.src;

  const isCredentialUser = session?.user?.provider === "credentials";

  return (
    <div className="p-2 max-w-xs mx-auto">
      <h1 className="text-xl font-semibold text-center mb-2">
        Profil de {session?.user?.name}
      </h1>

      {/* Afficher l'image uniquement quand elle est prête */}
      <div
        className={`rounded-full mx-auto flex flex-col items-center ${
          imageLoading ? "hidden" : "block"
        }`}
      >
        <Image
          src={profilePictureUrl}
          alt={`Photo de profil de ${session?.user?.name}`}
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
        Email : {session?.user?.email}
      </p>
      <div className="mt-6">
        {isCredentialUser && <ChangePassword />}
        <DeleteAccount />
        <UserGroups userId={session?.user?.id || ""} />
      </div>
    </div>
  );
};

export default ProfilPage;
