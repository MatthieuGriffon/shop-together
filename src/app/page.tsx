"use client";
import Link from "next/link";
import { useAppDispatch } from "../app/store/hooks";
import { openMenu } from "../app/features/menuSlice";

export default function Home() {
  const dispatch = useAppDispatch();

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
          <button
            onClick={() => dispatch(openMenu())} // Ouverture du menu avec Redux
            className="m-2 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
          >
            Commencer
          </button>
        </section>

        {/* Section Fonctionnalités */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <Link href="/groupes" passHref>
            <div className="p-3 rounded-lg shadow-lg bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition-colors duration-300">
              <h3 className="text-1xl font-semibold text-white">
                Gérez vos groupes
              </h3>
            </div>
          </Link>

          <Link href="/liste-course" passHref>
            <div className="bg-neutral-800 p-3 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-300">
              <h3 className="text-1xl font-semibold text-white">
                Listes de courses partagées
              </h3>
            </div>
          </Link>

          <Link href="/chat" passHref>
            <div className="bg-neutral-800 p-3 rounded-lg shadow-lg cursor-pointer hover:bg-neutral-700 transition-colors duration-300">
              <h3 className="text-1xl font-semibold text-white">
                Chat en temps réel
              </h3>
            </div>
          </Link>
        </section>
      </div>
    </main>
  );
}
