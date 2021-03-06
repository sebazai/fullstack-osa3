const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI


mongoose.connect(url, { useNewUrlParser: true })

const schema = new mongoose.Schema({
  name: String,
  number: String
})

schema.statics.format = function(person) {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

const Person = mongoose.model('Person', schema)

module.exports = Person