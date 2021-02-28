require("dotenv").config();
const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const url = process.env.MONGO_URI;

const Person = require("./models/persons");

// morgan config

morgan.token("content", (req, res) => {
  if (req.body) {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});

// middleware

app.use(express.static("build"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time[3] ms :content"
  )
);
app.use(cors());

console.info("Connecting to", url);

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.get("/info", (req, res) => {
  Person.find({}).then(result => {
    res.send(
      `<p>Phonebook has info on ${result.length} people</p> <p>${new Date(
        Date.now()
      )}</p>`
    );
  })
  
});

app.get("/api/persons/", (req, res, next) => {
  Person.find({})
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(person => res.json(person))
  
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndRemove(id)
    .then((person) => res.sendStatus(204))
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  });

  person.save().then((person) => res.json(person));
});

app.put("/api/persons/:id", (req, res, next) => {
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number,
  }

  Person.findByIdAndUpdate(req.params.id, updatedPerson).then(
    res.json(updatedPerson)
  ).catch(err => next(err))
});

// error handler

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  next(error);
};

app.use(errorHandler);

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});
