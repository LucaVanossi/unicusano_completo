import express from 'express';
import CategoriesModel from './model.js';
import createHttpError from 'http-errors';

const categoriesRouter = express.Router();

categoriesRouter.post("/", async (request, response, next) => { 
    try {
        const {categoriesId} = await CategoriesModel.create(request.body);
        response.status(201).send({categoriesId});
    } catch (error) {
        next(error)
    } 
});

categoriesRouter.get("/", async (request, response, next) => {
    try {
        const categories = await CategoriesModel.findAll();
        response.send(categories);
    } catch (error) {
        next(error)  
    }
});


categoriesRouter.get("/:categoriesId", async (request, response, next) => {
    try {
        const category = await CategoriesModel.findByPk(request.params.categoriesId);
        if (category)
            {
                response.send(category);
            }
            else
            {
                next (
                    createHttpError (
                        404,
                        `La categoria con id ${request.params.categoriesId} non è stato trovata nel database` 
                    )
                );
            } 
    } catch (error) {
        next(error) 
    }
});

categoriesRouter.put("/:categoriesId", async (request, response, next) => {
    try {
        const numeroRecordaggiornati = await CategoriesModel.update(request.body, {
            where: {id: request.params.categoriesId},
        });       
        if (numeroRecordaggiornati === 1)
            { 
                response.send();
            }
            else
            {
                next (
                    createHttpError (
                        404,
                        `La categoria con id ${request.params.categoriesId} non è stato trovata nel database`
                    )
                );
            }
    } catch (error) {
        next(error) 
    }
});

categoriesRouter.delete("/:categoriesId", async (request, response, next) => {
    try {
        const id = request.params.categoriesId;
        const numeroCancellazione = await CategoriesModel.destroy({ where: {id: id}});
        console.log("Numero di record cancellati: ", numeroCancellazione);
        response.status(204).send();
    } catch (error) {
        next(error) 
    }
});


export default categoriesRouter;