/* Users CRUD 
1. GET http://localhost:3001/users (+ opzionalmente query parameters)
2. POST http://localhost:3001/users (+ request body)
3. GET http://localhost:3001/users/:userId
4. PUT http://localhost:3001/users/:userId (+ request body)
5. DELETE http://localhost:3001/users/:userId
*/

import express from 'express';
import createHttpError from 'http-errors';
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import UserModel from './model.js';
import { validateUser } from './validation.js';

const usersRouter = express.Router(); //un Router è un insieme di endpoints

const CLOUDINARY_NAME = "unicusano";
const CLOUDINARY_KEY = "248112731642878";
const CLOUDINARY_SECRET = "BzrW9cLOGB6dXxRRbudyoHYW3u8";

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
});

const cloudinaryMiddleware = multer({
    storage: new CloudinaryStorage({
        cloudinary,
        params: {
            folder: "unicusano/users",
        }
    })
}).single("immagineProfilo")

//1.
usersRouter.get("/", async (request, response, next) => {
    try {
        // throw new Error("BOOOOOOOOOOOOOOM");
        const users = await UserModel.findAll({attributes: {exclude: ["password"]}});
        response.send(users);
    } catch (error) {
        next(error); //una volta che ho fatto il catch di un errore posso passarlo al primo error handler tramite next(error)
    }
});

//2.
usersRouter.post("/", validateUser, async (request, response, next) => { //riceveremo i dati del nuovo utente all'interno del request body, li inseriremo come nuovo record nela tabella users
    try {
        //console.log(request.body);
        const {id} = await UserModel.create(request.body);
        response.status(201).send({id});
    } catch (error) {
        next(error);
    }
});

//3.
usersRouter.get("/:userId", async (request, response, next) => {
    const id = request.params.userId; //nome utilizzato dopo /:
    const user = await UserModel.findByPk(id);
    if(user) {
        response.send(user);
    }
    else {
        next(createHttpError(404, `L'utente con id ${request.params.userId} non è stato trovato nel DB`));
    }
});

//4.
usersRouter.put("/:userId", async (request, response, next) => {
    const numeroRecordaggiornati = await UserModel.update(request.body, {
        where: {id: request.params.userId},
        returning: true,
        plain: true,
    });
    if(numeroRecordaggiornati === 1) {
        console.log("Numero record aggiornati", numeroRecordaggiornati);
        response.send();
    } else {
        next(createHttpError(404, `L'utente con id ${request.params.userId} non è stato trovato nel DB`));
    }
});

//5.
usersRouter.delete("/:userId", async (request, response, next) => {
    const numeroCancellazione = await UserModel.destroy({ where: {id: request.params.userId}});
    console.log("Numero di record cancellati: ", numeroCancellazione);
    if(numeroCancellazione) {
        response.status(204).send();
    }else {
        next(createHttpError(404, `L'utente con id ${request.params.userId} non è stato trovato nel DB`));
    }
});

usersRouter.put("/:userId/imgProfilo", cloudinaryMiddleware, async (req, res, next) => {
    try {
        console.log(req.file);
        await UserModel.update({imgProfilo: req.file.path}, {where: {id: req.params.userId}})
        res.send();
    } catch (error) {
        next(error);
    }
})

export default usersRouter;