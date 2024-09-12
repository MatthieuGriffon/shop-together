"use client"; // Indique que c'est un Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import FacebookLoginStatus from "./FacebookLoginStatus"; // Ton composant Facebook

export default function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const loading = status === "loading";

  if (loading) {
    return <p className="text-center text-gray-500">Chargement...</p>;
  }

  return (
    <header className="bg-gray-800 p-4 text-white">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Mon Application</h1>

        {/* Bouton du menu mobile */}
        <button
          className="block md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>

        {/* Liens de navigation pour desktop (cachés sur mobile) */}
        <nav className="hidden md:flex space-x-4">
          {session ? (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => signOut()}
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => signIn("google")}
              >
                Connexion Google
              </button>
              <button
                className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => signIn("facebook")}
              >
                Connexion Facebook
              </button>
              <FacebookLoginStatus />
            </>
          )}
        </nav>
      </div>

      {/* Menu mobile (affiché quand le bouton est cliqué) */}
      {menuOpen && (
        <nav className="mt-4 md:hidden">
          {session ? (
            <button
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => signOut()}
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <button
                className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2"
                onClick={() => signIn("google")}
              >
                Connexion Google
              </button>
              <button
                className="block w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded"
                onClick={() => signIn("facebook")}
              >
                Connexion Facebook
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
