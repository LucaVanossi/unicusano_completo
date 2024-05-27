import express from 'express';
import BlogsModel from './model.js';
import createHttpError from 'http-errors';
import UserModel from '../users/model.js';
import BlogsCategoriesModel from './blogsCategoriesModel.js';
import CategoriesModel from '../categories/model.js';

const blogsRouter = express.Router();

blogsRouter.post("/", async (request, response, next) => { 
    try {
        const {blogsId} = await BlogsModel.create(request.body);
        if(request.body.categories) {
            await BlogsCategoriesModel.bulkCreate(request.body.categories.map(category => {
                return {blogId: blogsId, categoryId: category}}));
        }
        response.status(201).send({blogsId});
    } catch (error) {
        next(error)
    } 
});

blogsRouter.get("/", async (request, response, next) => {
    try {
        const blogs = await BlogsModel.findAll({include: [{model: UserModel, attributes: ["nome", "cognome"]}]});
        response.send(blogs);
    } catch (error) {
        next(error)  
    }
});


blogsRouter.get("/:blogId", async (request, response, next) => {
    try {
        const blog = await BlogsModel.findByPk(request.params.blogId, {include: [{model: UserModel, attributes: ["nome", "cognome"]}
        , {model: CategoriesModel, attributes: ["nome"]}]});
        if (blog)
            {
                response.send(blog);
            }
            else
            {
                next (
                    createHttpError (
                        404,
                        `Il blog con id ${request.params.blogId} non è stato trovato nel database` 
                    )
                );
            } 
    } catch (error) {
        next(error) 
    }
});

blogsRouter.put("/:blogId", async (request, response, next) => {
    try {
        const numeroRecordaggiornati = await BlogsModel.update(request.body, {
            where: {id: request.params.blogId},
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
                        `Il blog con id ${request.params.blogId} non è stato trovato nel database` 
                    )
                );
            }
    } catch (error) {
        next(error) 
    }
});

blogsRouter.delete("/:blogId", async (request, response, next) => {
    try {
        const id = request.params.blogId;
        const numeroCancellazione = await BlogsModel.destroy({ where: {id: id}});
        console.log("Numero di record cancellati: ", numeroCancellazione);
        response.status(204).send();
    } catch (error) {
        next(error) 
    }
});

export default blogsRouter;