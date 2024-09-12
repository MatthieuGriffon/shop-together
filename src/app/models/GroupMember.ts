import { DataTypes } from "sequelize";
import { sequelize } from "../../../lib/sequelize";
import Group from "./Group";
import User from "./User";

const GroupMember = sequelize.define("GroupMember", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  group_id: {
    type: DataTypes.UUID,
    references: {
      model: Group,
      key: "id",
    },
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false, // ex: "admin", "membre"
  },
  joined_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default GroupMember;