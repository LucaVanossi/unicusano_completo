import sequelize from "../db.js";
import { DataTypes, ForeignKeyConstraintError } from "sequelize";

const UserModel = sequelize.define("user", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, //se non specifico questo valore di default mysql si aspetta che io passi un valore uuid ogni volta che faccio una insert
        primaryKey: true 
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cognome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    eta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nazionalita: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imgProfilo: {
        type: DataTypes.STRING
    }
});

export default UserModel;