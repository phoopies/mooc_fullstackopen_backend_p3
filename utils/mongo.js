const mongoose = require('mongoose');
const logger = require('./logger');
const config = require('./config');
// TODO use person.js

const url = `mongodb+srv://fullstack:${config.DB_PASSWORD}@moocfullstack.zrpnl.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
    date: Date,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
    logger.info(
        'To add a new one give the contact name and their phone number as arguments\n'
    );
    logger.info('Phonebook:');
    Person.find({}).then((result) => {
        result.forEach((person) => {
            logger.info(`${person.name} ${person.number}`);
        });
        mongoose.connection.close();
        process.exit(1);
    });
}

const name = process.argv[2];
const number = process.argv[3];

const person = new Person({
    name: name,
    number: number,
    date: new Date(),
});

person.save().then((result) => {
    logger.info('Person saved!\n', result);
    mongoose.connection.close();
});
