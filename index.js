const express = require("express");
const morgan = require("morgan");
morgan.token('body', (req, _res) => JSON.stringify(req.body));
const app = express();

persons = [
  {
    name: "b",
    number: "123",
    id: 2,
  },
];

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - body :body'));

app.get("/", (_req, res) => {
  res.send("<h1>Contact book!</h1>");
});

app.get("/info", (_req, res) => {
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p> ${new Date()} </p>
    `);
});

const generateId = () => {
  const id = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const existingPerson = persons.find((person) => person.id === id);
  // Could get stuck in a loop but very unlikely
  return existingPerson ? generateId() : id;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "Number missing",
    });
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: "Person already exists. Name must be unique",
    });
  }


  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(persons);
});

app.get("/api/persons", (_req, res) => {
  res.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const unknownEndpoint = (_request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
