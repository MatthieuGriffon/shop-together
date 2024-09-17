import { Model, DataTypes, Optional } from "sequelize";
import { sequelize } from "../../../lib/sequelize"; // Connexion à PostgreSQL

// Interface pour typer les attributs d'utilisateur
interface UserAttributes {
  id: string;
  email: string;
  name?: string; // Rendre le nom optionnel
  password?: string; // Le mot de passe est optionnel pour les utilisateurs OAuth
  oauth_provider?: string;
  oauth_id?: string;
  profile_picture_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface pour les attributs lors de la création
// Le mot de passe est optionnel lors de la création
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "password" | "created_at" | "updated_at"> {}

// Définition du modèle Sequelize
const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Le mot de passe est facultatif pour les utilisateurs OAuth
  },
  oauth_provider: {
    type: DataTypes.STRING,
    allowNull: true, // Peut être nul si l'utilisateur n'utilise pas OAuth
  },
  oauth_id: {
    type: DataTypes.STRING,
    allowNull: true, // Identifiant unique pour OAuth
  },
  profile_picture_url: {
    type: DataTypes.STRING, // Ajout du champ pour l'URL de la photo de profil
    allowNull: true, // Peut être nul si l'utilisateur n'a pas uploadé de photo
  },
  
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "Users", // Nom de la table
  timestamps: true, // Gestion automatique des champs createdAt et updatedAt
  createdAt: "created_at",
  updatedAt: "updated_at",
  freezeTableName: true, // Empêche Sequelize de pluraliser automatiquement le nom de la table

  // Hook avant chaque mise à jour
  hooks: {
    beforeUpdate: (user) => {
      user.setDataValue('updated_at', new Date()); // Met à jour le champ updated_at avant chaque mise à jour
    },
  }
});

export default User;