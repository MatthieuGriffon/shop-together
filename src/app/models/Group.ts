import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/sequelize';
import User from './User'; // Importer le modèle User

// Définition du modèle Group
class Group extends Model {
  public id!: string;
  public name!: string;
  public created_by!: string; // Clé étrangère vers l'utilisateur créateur
  public created_at!: Date;
  public updated_at!: Date;

  // Association pour accéder à l'utilisateur créateur
  public creator?:  typeof User;; // Associer l'utilisateur créateur via Sequelize
}

Group.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Group',
    tableName: 'Groups',
    timestamps: true,
  }
);

// Association entre Group et User (le créateur)
Group.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });

export default Group;
