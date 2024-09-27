import { DataTypes } from "sequelize";
import { sequelize } from "../../../lib/sequelize";
import ListItem from "./ListItem";
import User from "./User";

const ShoppingList = sequelize.define("ShoppingList", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  group_id: {
    type: DataTypes.UUID,
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
});

// Associations
ShoppingList.belongsTo(User, { as: 'creator', foreignKey: 'created_by' });
ShoppingList.hasMany(ListItem, { foreignKey: "list_id", as: "items" });

export default ShoppingList;
