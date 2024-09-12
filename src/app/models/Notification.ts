import { DataTypes } from "sequelize";
import { sequelize } from "../../../lib/sequelize";
import User from "./User";
import Group from "./Group";

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  group_id: {
    type: DataTypes.UUID,
    references: {
      model: Group,
      key: "id",
    },
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,  // ex: "message", "ajout d'article"
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Notification;