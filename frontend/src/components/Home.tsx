import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4 mt-[-5rem] ">
      <div className="bg-white text-xs p-10 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-lg font-bold mb-4 text-center">Bienvenue sur ShopTogether</h1>
        <p className="text-lg mb-4 text-xs">
          ShopTogether est votre application ultime de gestion de listes de courses familiales. Conçue pour simplifier et centraliser vos courses hebdomadaires, elle aide les familles à collaborer efficacement. Que vous ajoutiez, supprimiez ou partagiez des articles, ShopTogether rend les choses faciles.
        </p>
        <p className="text-lg mb-4">
          Principales fonctionnalités :
        </p>
        <ul className="list-disc list-inside mb-4 text-xs">
          <li>Créer et gérer plusieurs listes de courses</li>
          <li>Ajouter, modifier et supprimer des articles facilement</li>
          <li>Partager des listes avec les membres de la famille</li>
          <li>Recevoir des notifications pour les mises à jour</li>
          <li>Interface conviviale pour tous les âges</li>
        </ul>
        <p className="text-xs">
          Commencez dès maintenant en créant un compte ou en vous connectant !
        </p>
      </div>
    </div>
  );
};

export default Home;
