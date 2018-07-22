const mongoose = require('mongoose')

const url = "mongodb://diana:Carles123@ds245661.mlab.com:45661/seba-puhelinluettelo"

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