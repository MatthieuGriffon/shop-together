import Header from "./components/Header"; // Import du Header

export default function Home() {
  return (
    <div>
      <Header /> {/* Utilisation du Header avec la logique de connexion */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4">
            Contenu de la page d&apos;accueil
          </h2>
          <p>
            Bienvenue sur la page principale de votre application. Vous pouvez
            ajouter d&apos;autres contenus ici.
          </p>
        </div>
      </div>
    </div>
  );
}
