const http = require("http");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static("build"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const currentTime = new Date().toUTCString();
  const res = 'Phonebook has info for '+ persons.length +' people<br/>' + currentTime
  response.send(res)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(n => n.id === id)
  if(person) {
    response.json(person)
  }
  else {
    response.send(404).end();
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(n => n.id !== id)
  response.status(204).end();
})

const generateId = () => {
  const min = 10
  const max = 100000
  return Math.floor(Math.random() * (max - min) + min);
};

app.post("/api/notes",(request, response) => {
  const body = request.body
  if(!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const isNamePresent = persons.find(n => n.name === body.name)
  if(isNamePresent) {
    return response.status(406).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
