const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(bodyParser.json())
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.send(`<p>puhelinluettelossa ${persons.length} henkilön tiedot
            <br />${new Date()}`)
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/api/persons/:id', (request, response) => {
  //const id = Number(request.params.id)
  //console.log(id)
  //const person = persons.find(person => person.id === id)
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(Person.format(person))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

})

app.delete('/api/persons/:id', (request, response) => {
  /*const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)*/
  Person.findByIdAndRemove(request.params.id)
    .then(response.status(204).end())
    .catch(error => {
      console.log(error)
    })
    //response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new:true })
    .then(updatedPerson => {response.json(Person.format(updatedPerson))})
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.hasOwnProperty('name') || body.name === '') {
    return response.status(400).json({ error: 'name missing' })
  } /*else if(
        Person
        .find({name: body.name})
        .then(personFound => {
            console.log(personFound)
            console.log(body.name)
            if(personFound.name === body.name) {
                return true
            } else {
                return false
            }
        })
    )
        return response.status(400).json({error: 'name must be unique'})*/
  else if(!body.hasOwnProperty('number') || body.number === '') {
    return response.status(400).json({ error: 'number missing' })
  }

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  Person
    .findOne({ name: body.name })
    .then(foundPerson => {
      if(foundPerson === null) {
        person
          .save()
          .then(savedPerson => {
            response.json(Person.format(savedPerson))
          })
          .catch(error => {
            console.log(error)
          })
      } else if (foundPerson.name === body.name) {
        return response.status(400).json({ error: 'name must be unique' })
      }
    })
    .catch(error => {
      console.log(error)
    })

})



const PORTTI = process.env.PORT ||3001
app.listen(PORTTI, () => {
  console.log(`Serveri running on portti ${PORTTI}`)
})