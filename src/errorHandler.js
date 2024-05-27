export const badRequestErrorHandler = (err, req, res, next) => {
    if(err.status === 400) {
        res.status(400).send({status: "Non successo", messaggio: err.message, listaErrori: err.listaErrori});
    } else {
        next(err);
    }
}

export const unauthoruzedErrorHandler = (err, req, res, next) => {
    if(err.status === 401) {
        res.status(401).send({status: "Non successo",messaggio: err.message});
    } else {
        next(err);
    }
}

export const forbiddenErrorHandler = (err, req, res, next) => {
    if(err.status === 403) {
        res.status(403).send({status: "Non successo", messaggio: err.message});
    } else {
        next(err);
    }
}

export const notFoundErrorHandler = (err, req, res, next) => {
    if(err.status === 404) {
        res.status(404).send({status: "Non successo", messaggio: err.message});
    } else {
        next(err);
    }
}

export const genericErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({status: "Non successo", messaggio: "Errore generico del server"});
}