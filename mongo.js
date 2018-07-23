const mongoose = require('mongoose')

const url = 'mongodb://xxx:xxx@ds245661.mlab.com:45661/seba-puhelinluettelo'

mongoose.connect(url, { useNewUrlParser: true })


const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if(process.argv[2] === undefined || process.argv[3] === undefined) {
  Person
    .find({})
    .then(result => {
      console.log('Puhelinluettelo:')
      result.forEach(person => console.log(person.name, person.number))
      mongoose.connection.close()
    })
} else {
  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log(`lisätään henkilö ${process.argv[2]} numero ${process.argv[3]} luetteloon`)
      mongoose.connection.close()
    })
}