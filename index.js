const express = require("express");
const morgan = require("morgan");
const errorHandler = require("./errorHandler");
const { Person, disconnect } = require("./models/person");
const app = express();

app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req, _res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - body :body"
  )
);

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
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

app.get("/api/persons", (_req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then((_res) => response.status(204).end())
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
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

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.on("close", () => {
  disconnect();
});

app.use(errorHandler);
