const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },

    {
        name: "Martti Tienari",
        number: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        number: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        number: "040-123468",
        id: 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot
    <br />${new Date()}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
      if (person) {
          const information = `<p>ID: ${person.id} <br /> Nimi: ${person.name}<br />Numero: ${person.number}</p>`
          response.send(information)
      } else {
          response.status(404).end()
      }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.hasOwnProperty('name') || body.name === "") {
        return response.status(400).json({error: 'name missing'})
    } else if(persons.some(p => p.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})
    } else if(!body.hasOwnProperty('number') || body.number === "") {
        return response.status(400).json({error: 'number missing'})
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * (9001 - 1)) + 1
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORTTI = 3001
app.listen(PORTTI, () => {
    console.log(`Serveri running on portti ${PORTTI}`)
})