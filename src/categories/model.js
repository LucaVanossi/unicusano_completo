import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const CategoriesModel = await sequelize.define("category", {
    categoryId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
});

export default CategoriesModel;