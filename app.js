const express = require('express');
const personRouter = require('./controllers/person');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

const disconnect = () => {
    logger.info('Disconnecting...');
    mongoose.connection.disconnect();
};

logger.info('Connecting to database...');

mongoose.connect(config.DB_URL)
    .then((_result) => logger.info('Connected to database'))
    .catch((error) => logger.error('Failed to connect\n', error));


app.use(express.static('build'));
app.use(express.json());
app.use('/api/persons', personRouter);
app.use(middleware.morganLogger);

app.on('close', () => {
    disconnect();
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
