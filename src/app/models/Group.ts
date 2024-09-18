// models/Group.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../../lib/sequelize'; // Ton instance Sequelize
import User from './User';

// Interface pour les attributs du modèle Group
interface GroupAttributes {
  id: string;
  name: string;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface pour définir les attributs nécessaires lors de la création (id est généré automatiquement)
interface GroupCreationAttributes extends Optional<GroupAttributes, 'id' | 'created_at' | 'updated_at'> {}

// Classe du modèle Group avec les attributs et les méthodes associées
class Group extends Model<GroupAttributes, GroupCreationAttributes> implements GroupAttributes {
  public id!: string;
  public name!: string;
  public created_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

// Initialisation du modèle avec Sequelize
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
      references: {
        model: User,
        key: 'id',
      },
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
    sequelize, // Instance Sequelize
    modelName: 'Group',
    tableName: 'Groups', // Assurez-vous que ce nom correspond à celui dans ta base de données
    timestamps: true, // Pour gérer createdAt et updatedAt automatiquement
    underscored: true,
  }
);

export default Group;