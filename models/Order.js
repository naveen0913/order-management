import { DataTypes } from "sequelize";
import sequelize from "../config/DbConfig.js";

const Orders = sequelize.define("orders", {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
  },
  customer_id: {
    type: DataTypes.INTEGER,
  },
  product_name: {
    type: DataTypes.STRING,
  },

  quantity: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.FLOAT,
  },
  order_date: {
    type: DataTypes.DATEONLY,
  },
});

export default Orders;
