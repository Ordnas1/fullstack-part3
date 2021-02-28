const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123457",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
];

// morgan config

morgan.token("content", (req, res) => {
  if (req.body) {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});

// middleware

app.use(express.static('build'))
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time[3] ms :content"
  )
);
app.use(cors())

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info on ${persons.length} people</p> <p>${new Date(
      Date.now()
    )}</p>`
  );
});

app.get("/api/persons/", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons[persons.findIndex((person) => person.id === id)];

  if (person) {
    res.json(person);
  } else {
    res.sendStatus(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.sendStatus(204).end();
});

app.post("/api/persons", (req, res) => {
  const person = req.body;

  if (!req.body.name) {
    res.status(400).json({ error: "Name not included" });
    r;
  } else if (!req.body.number) {
    res.status(400).json({ error: "Number not included" });
  } else if (
    persons.filter((person) => person.name === req.body.name).length != 0
  ) {
    res.status(400).json({ error: "name already exists" });
  } else {
    person.id = uuidv4();
    persons = persons.concat(person);
    res.json(person);
  }
});

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
