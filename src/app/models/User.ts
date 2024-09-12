import { DataTypes } from "sequelize";
import { sequelize } from "../../../lib/sequelize";  // Connexion à PostgreSQL

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  oauth_provider: {
    type: DataTypes.STRING,
    allowNull: true,  // Stocke le fournisseur OAuth (Google, Facebook)
  },
  oauth_id: {
    type: DataTypes.STRING,
    allowNull: true,  // Identifiant unique OAuth
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  timestamps: true,  // Permet à Sequelize de gérer automatiquement createdAt et updatedAt
  createdAt: "created_at",
  updatedAt: "updated_at",
  freezeTableName: true,

  // Hook avant chaque mise à jour
  hooks: {
    beforeUpdate: (user) => {
      user.setDataValue('updated_at', new Date());  // Utilise setDataValue pour mettre à jour
    },
  }
});

export default Users;
