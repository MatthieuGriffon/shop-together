"use client"; // Indique que c'est un Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import FacebookLoginStatus from "./FacebookLoginStatus"; // Ton composant Facebook

export default function Header() {
  const [name, setName] = useState("");
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true); // Pour basculer entre connexion et inscription
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const loading = status === "loading";

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error); // Affiche l'erreur si elle existe
    } else {
      setError(null); // Reset de l'erreur
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      setSuccess(true); // Succès de l'inscription
      setError(null); // Reset des erreurs
    } else {
      const data = await res.json();
      setError(data.message || "Erreur lors de l'inscription");
    }
  };

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
              {showLoginForm ? (
                <div className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Connexion
                    </button>
                  </form>
                  <p>
                    Pas encore de compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(false)}
                    >
                      Inscrivez-vous
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium"
                      >
                        Nom d&apos;utilisateur
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && (
                      <p className="text-green-500">
                        Inscription réussie. Vous pouvez maintenant vous
                        connecter.
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Créer un compte
                    </button>
                  </form>
                  <p>
                    Vous avez déjà un compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(true)}
                    >
                      Connectez-vous
                    </button>
                  </p>
                </div>
              )}

              <div className="mt-4">
                <button
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  onClick={() => signIn("google")}
                >
                  Connexion Google
                </button>

                <button
                  className="block w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded transition-colors duration-200 mt-2"
                  onClick={() => signIn("facebook")}
                >
                  Connexion Facebook
                </button>
                <FacebookLoginStatus />
              </div>
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
              {showLoginForm ? (
                <div className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Connexion
                    </button>
                  </form>
                  <p>
                    Pas encore de compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(false)}
                    >
                      Inscrivez-vous
                    </button>
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium"
                      >
                        Mot de passe
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded"
                      />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    {success && (
                      <p className="text-green-500">
                        Inscription réussie. Vous pouvez maintenant vous
                        connecter.
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Créer un compte
                    </button>
                  </form>
                  <p>
                    Vous avez déjà un compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(true)}
                    >
                      Connectez-vous
                    </button>
                  </p>
                </div>
              )}

              <div className="mt-4">
                <button
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                  onClick={() => signIn("google")}
                >
                  Connexion Google
                </button>

                <button
                  className="block w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded mt-2"
                  onClick={() => signIn("facebook")}
                >
                  Connexion Facebook
                </button>
              </div>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
