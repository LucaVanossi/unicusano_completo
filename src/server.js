//devo aggiungere al package.json "type": "module" per utilizzare la sintassi import
import express from 'express';
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import usersRouter from './users/index.js';
import { mysqlConncect, syncModels } from './db.js';
import { badRequestErrorHandler, forbiddenErrorHandler, genericErrorHandler, notFoundErrorHandler, unauthoruzedErrorHandler } from './errorHandler.js';
import createHttpError from 'http-errors';

const server = express();

const port = process.env.PORT;

//MIDDLEWARE
// const loggerMiddleware = (req, res, next) => {
//     console.log(`Metodo richiesta ${req.method} --url ${req.url} -- ${new Date()}`);
//     req.user = "Luca";
//     next(); //è una funzione che andiamo ad utilizzare quando nel nostro middleware vogliamo passare il controllo a chi viene dopo
//     //res.status(400).send({messaggio: "BAD REQUEST"}); //esempio di risposta
// }

// const policeMiddleware = (req, res, next) => {
//     if(req.user === 'Luca') {
//         res.status(401).send({messaggio: "I Luca non possono entrare!"});
//     } else {
//         next();
//     }
// }

// server.use(loggerMiddleware);
// server.use(policeMiddleware);

const whiteList = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOpt = {
    origin: (origin, corsNext) => {
        console.log("ORIGIN:", origin);
        if(whiteList.indexOf(origin) !== -1) {
            //se sei nella whitelist puoi passare avanti
            corsNext(null, true);
        } else {
            //altrimenti --> errore
            corsNext(createHttpError(400,`La tua origin ${origin} non è nella lista`));
        }
    }
}

server.use(cors());
server.use(express.json()); //non dimentichiamo di aggiungere questa direttiva prima della dichiarazione degli endpoints, altrimenti il body della richieste sarà undefined!!!

// ENDPOINTS
server.use("/users", usersRouter);

//ERROR HANDLERS
server.use(badRequestErrorHandler);
server.use(unauthoruzedErrorHandler);
server.use(forbiddenErrorHandler);
server.use(notFoundErrorHandler);
server.use(genericErrorHandler);

await mysqlConncect();
await syncModels();

server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Il server sta scoltando sulla porta ${port}`);
});

