const express = require("express");
const app = express();

const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(cors());

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :body"
  )
);

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
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
  {
    name: "acb",
    number: "123",
    id: 5,
  },
  {
    name: "abc",
    number: "12353w3251235",
    id: 6,
  },
  {
    name: "abc",
    number: "12353w3251235",
    id: 7,
  },
  {
    name: "abc",
    number: "12353w3251235",
    id: 8,
  },
  {
    name: "abc",
    number: "12353w3251235",
    id: 9,
  },
  {
    name: "abc",
    number: "12353w3251235",
    id: 10,
  },
];

// GET

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.send(person);
  }
});

app.get("/api/persons", (req, res) => {
  res.send(persons);
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
});

// POST

app.post("/api/persons", (req, res) => {
  if (!req.body.name) {
    res.status(400).send({ error: "A name must be provided" });
  } else if (!req.body.number) {
    res.status(400).send({ error: "A number must be provided" });
  } else if (persons.filter((ele) => ele.name === req.body.name).length > 0) {
    res.status(400).send({
      error: `Name must be unique. ${req.body.name} is already in the phonebook`,
    });
  } else {
    const newPers = {
      name: req.body.name,
      number: req.body.number,
      id: Math.floor(Math.random() * 1000),
    };

    persons.push(newPers);
    res.send(newPers);
  }
});

// DELETE

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    persons = persons.filter((ele) => ele.id !== person.id);
    res.status(204).send();
  }
});

// SERVER

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
