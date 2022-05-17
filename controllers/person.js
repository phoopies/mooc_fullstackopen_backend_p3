const router = require('express').Router();
const Person = require('../models/person');

router.put('/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(
        request.params.id,
        person,
        { new: true, runValidators: true, context: 'query' }
    )
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch(error => next(error));
});

router.post('/', (request, response, next) => {
    const body = request.body;

    // TODO
    // Person.find({}).then((persons) => {
    //   if (persons.find((person) => person.name === body.name)) {
    //     response
    //       .status(400)
    //       .json({
    //         error: "Person already exists. Name must be unique",
    //       })
    //       .end();
    //   }
    // });

    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
    });

    person
        .save()
        .then((savedPerson) => {
            response.json(savedPerson);
        })
        .catch((error) => next(error));
});

router.get('/', (_req, res) => {
    Person.find({}).then((persons) => res.json(persons));
});

router.delete('/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((_res) => response.status(204).end())
        .catch((error) => next(error));
});

router.get('/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch((error) => next(error));
});

module.exports = router;