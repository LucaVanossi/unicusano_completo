import createHttpError from "http-errors";
import Joi from "joi";

const userSchema = Joi.object({ //molteplici possibilità di validazione
    nome: Joi.string().required(),
    cognome: Joi.string().required(),
    eta: Joi.number().integer().required().min(0),
    nazionalita: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().alphanum().min(8).max(30).required(),
});

// const risultato = userSchema.validate(req.body);

const validatorMiddleware = schema => (req, res, next) => { //funzione che dato uno schema mi torna un middleware
    const {body} = req;
    //uso lo schema per validare il req.body
    const risultato = schema.validate(body, {abortEarly: false}) //abortEarly: se Joi trova un errore termina subito la validazione
    if (risultato.error) {
        //se Joi mi restituisce una lista errori --> errore 400
        next(createHttpError(400, "Errori nel body", {listaErrori: risultato.error.details.map(error => error.message)}));
    } else {
    //se Joi non restituisce errore posso procedere con il flusso normale
    next();
    }
}

export const validateUser = validatorMiddleware(userSchema);