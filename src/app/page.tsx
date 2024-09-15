export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center bg-slate-600">
      <div className="max-w-7xl mx-auto px-4 bg-slate-700 flex-grow">
        {/* Section principale : Présentation */}
        <section className="text-center mb-5 p-2 bg-neutral-800 rounded-lg">
          <h1 className="text-2xl font-bold text-white mb-4">
            Bienvenue sur Shop-Together
          </h1>
          <p className="text-lg text-white text-justify p-1">
            Simplifiez vos achats en groupe avec Shop-Together. Créez et gérez
            des listes de courses avec vos coéquipiers, suivez les articles en
            temps réel, et restez organisé sans effort.
          </p>
          <button className="m-2 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
            Commencer
          </button>
        </section>

        {/* Section Fonctionnalités */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg shadow-lg bg-neutral-800">
            <h3 className="text-1xl font-semibold ">Gérez vos groupes</h3>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg shadow-lg">
            <h3 className="text-1xl font-semibold">
              Listes de courses partagées
            </h3>
          </div>
          <div className="bg-neutral-800 p-3 rounded-lg shadow-lg">
            <h3 className="text-1xl font-semibold">Chat en temps réel</h3>
          </div>
        </section>
      </div>
    </main>
  );
}
