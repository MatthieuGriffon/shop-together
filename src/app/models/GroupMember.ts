import { DataTypes, Model, Association } from 'sequelize';
import { sequelize } from '../../../lib/sequelize';
import Group from './Group';
import User from './User';

interface GroupMemberAttributes {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: Date;
}

class GroupMembers extends Model<GroupMemberAttributes> implements GroupMemberAttributes {
  public id!: string;
  public group_id!: string;
  public user_id!: string;
  public role!: string;
  public joined_at!: Date;

  // Associer un groupe à chaque membre du groupe
  public static associations: {
    group: Association<GroupMembers, Group>;
  };
}

GroupMembers.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Group,
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joined_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'GroupMembers',
    tableName: 'GroupMembers',
    timestamps: true,
  }
);

// Associer GroupMembers à Group
GroupMembers.belongsTo(Group, { foreignKey: 'group_id' });

export default GroupMembers;