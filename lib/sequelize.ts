import { Sequelize } from "sequelize";
import pg from "pg"; 
import dotenv from "dotenv";

// Charger les variables d'environnement depuis le fichier .env.local
dotenv.config({ path: '.env' });

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Vérifie si DATABASE_URL est correctement chargée


// Assurez-vous que DATABASE_URL est définie
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL non définie dans .env.local");
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectModule: pg,
  protocol: "postgres",
  logging:  console.log, // Désactiver les logs SQL pour plus de clarté
});
