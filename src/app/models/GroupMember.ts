import { Model, DataTypes, BelongsToGetAssociationMixin } from 'sequelize';
import { sequelize } from '../../../lib/sequelize';
import Group from './Group';
import User from './User'; // Importer User en tant que valeur

// Utiliser typeof pour extraire le type du modèle User
class GroupMembers extends Model {
  public user_id!: string;
  public group_id!: string;
  public role!: string;

  // Association mixin
  public getGroup!: BelongsToGetAssociationMixin<Group>;
  public getUser!: BelongsToGetAssociationMixin<typeof User>;

  // Ajoute la propriété Group et User pour accéder aux données
  public Group?: Group;
  public User?: typeof User;
}

GroupMembers.init({
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'GroupMembers',
  tableName: 'GroupMembers', // Correspond à la table SQL
  timestamps: true,
});

// Associations
GroupMembers.belongsTo(Group, { foreignKey: 'group_id', as: 'Group' });
GroupMembers.belongsTo(User, { foreignKey: 'user_id', as: 'User' });

export default GroupMembers;
