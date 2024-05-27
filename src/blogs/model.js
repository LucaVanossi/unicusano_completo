import sequelize from "../db.js";
import { DataTypes } from "sequelize";
import UserModel from '../users/model.js';
import CategoriesModel from "../categories/model.js";
import BlogsCategoriesModel from "./blogsCategoriesModel.js";

const BlogsModel = sequelize.define("blog", {
    blogsId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    titolo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contenuto: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Relazione 1 a molti

UserModel.hasMany(BlogsModel);
BlogsModel.belongsTo(UserModel, {foreignKey: "userId", allowNull: false});

//Relazione molti a molti
BlogsModel.belongsToMany(CategoriesModel, {through: BlogsCategoriesModel, foreignKey: {name:"blogId", allowNull: false}});
CategoriesModel.belongsToMany(BlogsModel, {through: BlogsCategoriesModel, foreignKey: {name:"categoryId", allowNull: false}});

export default BlogsModel;