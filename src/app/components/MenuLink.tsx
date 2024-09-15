import React from "react";
import Link from "next/link";

function MenuLink() {
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
          Liste de courses
        </Link>
        <Link
          href="/chat"
          className="hover:text-gray-700 hover:bg-white rounded-sm p-1"
        >
          Chat
        </Link>
      </nav>
    </div>
  );
}

export default MenuLink;
