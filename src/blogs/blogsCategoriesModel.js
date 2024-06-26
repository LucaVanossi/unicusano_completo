import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const BlogsCategoriesModel = sequelize.define("blogCategory", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});

export default BlogsCategoriesModel;