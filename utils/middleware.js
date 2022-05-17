const morgan = require('morgan');

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, _request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }

    next(error);
};

morgan.token('body', (req, _res) => JSON.stringify(req.body));
const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms - body :body');

module.exports = {
    unknownEndpoint,
    errorHandler,
    morganLogger
};