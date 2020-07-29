require("dotenv").config();

const express = require("express");
const app = express();

const Person = require("./models/person");

const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
);

// GET

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((pers) => {
      res.json(pers);
    })
    .catch((err) => next(err));
});

app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
  const date = new Date();
  let persons = [];
  Person.find({})
    .then((result) => {
      persons = result;
    })
    .then(() => {
      res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
    })
    .catch((err) => next(err));
});

// POST

app.post("/api/persons", (req, res, next) => {
  if (!req.body.name) {
    res.status(400).send({ error: "A name must be provided" });
  } else if (!req.body.number) {
    res.status(400).send({ error: "A number must be provided" });
  } else {
    const newPers = new Person({
      name: req.body.name,
      number: req.body.number,
    });
    newPers
      .save()
      .then((savedPers) => {
        res.json(savedPers.toJSON());
      })
      .catch((err) => next(err));
  }
});

// PUT

app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPers) => {
      res.json(updatedPers);
    })
    .catch((err) => next(err));
});

// DELETE

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

// ERROR HANDLING

const errorHandler = (err, req, res, next) => {
  console.log(err);
  console.error(err.name, " - ", err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (err.name === "ValidationError") {
    if (err.errors.name.properties.type === "unique") {
      return res.status(400).json({
        error: `Please provide a unique name. There is already an entry for ${err.errors.name.properties.value} in the phonebook.`,
      });
    } else {
      return res.status(400).json({ error: err });
    }
  }
  next(err);
};

app.use(errorHandler);

// SERVER

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
