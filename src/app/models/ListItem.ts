// models/ListItem.ts
import { DataTypes } from "sequelize";
import { sequelize } from "../../../lib/sequelize";
import ShoppingList from "./ShoppingList";
import User from "./User";
import Category from "./Category";

const ListItem = sequelize.define("ListItem", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  list_id: {
    type: DataTypes.UUID,
    references: {
      model: ShoppingList,
      key: "id",
    },
  },
  category_id: {
    type: DataTypes.UUID,
    references: {
      model: Category,
      key: "id",
    },
  },
  added_by: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: "id",
    },
  },
  checked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
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

export default ListItem;
