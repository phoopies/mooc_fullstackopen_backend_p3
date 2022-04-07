const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGODB_URL;
console.log('Connecting to database...');
mongoose
    .connect(url)
    .then((_result) => console.log('Connected to database'))
    .catch((error) => console.log('Failed to connect\n', error));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: (s) =>
                /^\d{2}-\d{6}\d*$/.test(s) || /^\d{3}-\d{5}\d*$/.test(s),
            message: (props) =>
                `${props.value} is not a valid phone number! A number must have at least 8 digits and a - between the 2/3 first numbers and the rest`,
        },
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

personSchema.set('toJSON', {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const disconnect = () => {
    console.log('Disconnecting...');
    mongoose.connection.disconnect();
};

module.exports = {
    Person: mongoose.model('Person', personSchema),
    disconnect: disconnect,
};
