import { Sequelize } from "sequelize";

const {MYSQL_DB, MYSQL_USER, MYSQL_PW,MYSQL_HOST,MYSQL_PORT} = process.env;

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PW, {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: "mysql"
});

export const mysqlConncect = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connessione a MySQL avvenuta correttamente");
    } catch (error) {
        console.log(error);
        process.exit(1); //esci dall'applicazione NodeJS se non si riesce a connettersi al DB
    }
}

export const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true }); //si occupa di verificare che le tables nel db corrispondono al mio modello
    } catch (error) {
        console.log(error);
    }
}

export default sequelize;