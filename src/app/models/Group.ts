import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/sequelize';

// Définition du modèle Group
class Group extends Model {
  public id!: string;
  public name!: string;
  public created_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
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

export default Group;
