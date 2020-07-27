const express = require("express");
const app = express();

const persons = [
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
];

// GET

app.get("/api/persons/:id", (req, res) => {
  console.log(req.params);
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

// DELETE

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
