import { DataTypes } from "sequelize";
import sequelize from "../config/DbConfig.js";

const Products = sequelize.define("products",{
    product_id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    product_name:{
        type:DataTypes.STRING
    },
    price:{
        type:DataTypes.FLOAT
    }
})

export default Products;