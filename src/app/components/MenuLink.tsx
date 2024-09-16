"use client";
import React from "react";
import Link from "next/link";

import { useSession } from "next-auth/react";

function MenuLink() {
  const { status } = useSession();
  return (
    <div className="bg-slate-700 text-gray-100 flex flex-row items-center w-full font-bold text-1xl text justify-evenly p-4">
      <nav className="space-x-4">
        <Link
          href="/"
          className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
        >
          Accueil
        </Link>
        <Link
          href="/groupes"
          className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
        >
          Groupes
        </Link>
        <Link
          href="/liste-course"
          className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
        >
          Liste
        </Link>
        <Link
          href="/chat"
          className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
        >
          Chat
        </Link>
        {/* Si l'utilisateur est connecté, afficher le lien Profil */}
        {status === "authenticated" && (
          <Link
            href="/profil"
            className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
          >
            Profil
          </Link>
        )}
      </nav>
    </div>
  );
}

export default MenuLink;
