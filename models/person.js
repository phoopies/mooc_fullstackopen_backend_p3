const mongoose = require('mongoose');

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

module.exports = mongoose.model('Person', personSchema);
