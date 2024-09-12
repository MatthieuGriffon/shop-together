import { sequelize } from "../lib/sequelize";  // Connexion à la base de données
import User from "../src/app/models/User";  // Modèle utilisateur
import ShoppingList from "../src/app/models/ShoppingList";  // Modèle liste de courses
import Category from "../src/app/models/Category";  // Modèle catégorie
import ListItem from "../src/app/models/ListItem";  // Modèle élément de liste
import Group from "../src/app/models/Group";  // Modèle groupe
import GroupMember from "../src/app/models/GroupMember";  // Modèle membre de groupe
import Message from "../src/app/models/Message";  // Modèle message
import Notification from "../src/app/models/Notification";  // Modèle notification

import dotenv from "dotenv";
dotenv.config();

console.log("DATABASE_URL:", process.env.DATABASE_URL);


// Utilisation explicite pour satisfaire l'avertissement
[User, ShoppingList, Category, ListItem, Group, GroupMember, Message, Notification].forEach(model => model);

async function syncModels() {
  await sequelize.sync({ force: true });  // Utilise force: false pour éviter de recréer les tables
  console.log("Modèles synchronisés avec la base de données.");
}

syncModels().catch(console.error);