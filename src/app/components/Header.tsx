"use client"; // Indique que c'est un Client Component

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import FacebookLoginStatus from "./FacebookLoginStatus";
import Image from "next/image";
import { Menu } from "lucide-react";

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

  useEffect(() => {
    if (window.location.hash === "#_=_") {
      // Remplace 'null' par une chaîne de caractères vide
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

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
    <header className="bg-gray-900 p-5 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Image
            src="/logo_shop-together.png"
            width={60}
            height={60}
            style={{ objectFit: "contain", width: "auto", height: "auto" }}
            alt="logo-shop-together"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-wide">Shop-Together</h1>
        {/* Mobile menu button */}
        <button
          className={`md:hidden text-white focus:outline-none transform transition-transform duration-300 ${
            menuOpen ? "rotate-90" : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open Menu"
        >
          <Menu size={32} /> {/* Utilisation de l'icône de Lucide */}
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-6 items-center">
          {session ? (
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded shadow transition-all duration-300"
              onClick={() => signOut()}
            >
              Se déconnecter
            </button>
          ) : (
            <div className="space-x-4 flex items-center">
              {showLoginForm ? (
                <form
                  onSubmit={handleSignIn}
                  className="space-y-4 w-full max-w-xs bg-gray-100 p-4 rounded-lg shadow-lg"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="input-field"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Mot de passe"
                    className="input-field mt-2"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-3 transition-all duration-300"
                  >
                    Connexion
                  </button>
                  <p className="text-sm text-center">
                    Pas encore de compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(false)}
                    >
                      Inscrivez-vous
                    </button>
                  </p>
                </form>
              ) : (
                <form
                  onSubmit={handleSignUp}
                  className="space-y-4 w-full max-w-xs bg-gray-100 p-4 rounded-lg shadow-lg"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Nom d'utilisateur"
                    className="input-field text-black"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email"
                    className="input-field mt-2 text-black"
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Mot de passe"
                    className="input-field mt-2 text-black"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                  {success && (
                    <p className="text-green-500 text-center">
                      Inscription réussie. Connectez-vous.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3 transition-all duration-300"
                  >
                    Créer un compte
                  </button>
                  <p className="text-sm text-center">
                    Vous avez déjà un compte ?{" "}
                    <button
                      className="text-blue-500 underline"
                      onClick={() => setShowLoginForm(true)}
                    >
                      Connectez-vous
                    </button>
                  </p>
                </form>
              )}
            </div>
          )}

          {/* Google & Facebook buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => signIn("google")}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
            >
              Connexion Google
            </button>
            <button
              onClick={() => signIn("facebook")}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded transition-all duration-300"
            >
              Connexion Facebook
            </button>
            <FacebookLoginStatus />
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden mt-5 space-y-3 bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col  p-4 rounded-lg shadow-lg">
          {session ? (
            <button
              className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all duration-300"
              onClick={() => signOut()}
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <div className="space-y-4 flex flex-row justify-center">
                {showLoginForm ? (
                  <form
                    onSubmit={handleSignIn}
                    className="space-y-4 w-full max-w-xs bg-black p-4 rounded-lg shadow-lg justify-center"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="input-field text-black w-full"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Mot de passe"
                      className="input-field mt-2 text-black w-full"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-3 transition-all duration-300"
                    >
                      Connexion
                    </button>
                    <p className="text-sm text-center">
                      Pas encore de compte ?{" "}
                      <button
                        className="text-blue-500 underline"
                        onClick={() => setShowLoginForm(false)}
                      >
                        Inscrivez-vous
                      </button>
                    </p>
                  </form>
                ) : (
                  <form
                    onSubmit={handleSignUp}
                    className="space-y-4 w-full max-w-xs bg-black  p-4 rounded-lg shadow-lg"
                  >
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Nom d'utilisateur"
                      className="input-field text-black w-full"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Email"
                      className="input-field mt-2 text-black w-full"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Mot de passe"
                      className="input-field mt-2 text-black w-full"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    {success && (
                      <p className="text-green-500 text-center">
                        Inscription réussie. Connectez-vous.
                      </p>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3 transition-all duration-300"
                    >
                      Créer un compte
                    </button>
                    <p className="text-sm text-center">
                      Vous avez déjà un compte ?{" "}
                      <button
                        className="text-blue-500 underline"
                        onClick={() => setShowLoginForm(true)}
                      >
                        Connectez-vous
                      </button>
                    </p>
                  </form>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <button
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold  mt-2 py-2 px-4 rounded transition-all duration-300"
                  onClick={() => signIn("google")}
                >
                  Connexion Google
                </button>

                <button
                  className="block w-full bg-blue-700 hover:bg-blue-800 text-white font-bold mt-2 py-2 px-4 rounded transition-all duration-300"
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
