const mongoose = require('mongoose');
require('dotenv').config();

// TODO use person.js

const pw = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const url = `mongodb+srv://fullstack:${pw}@moocfullstack.zrpnl.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
    date: Date,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
    console.log(
        'To add a new one give the contact name and their phone number as arguments\n'
    );
    console.log('Phonebook:');
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`);
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
    console.log('Person saved!\n', result);
    mongoose.connection.close();
});
