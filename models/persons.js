const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

const personSchema = new mongoose.Schema({
  name: {type: String, unique: true, minLength: 3},
  number: {type: String, maxLength: 8},
});

personSchema.plugin(uniqueValidator)

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("person", personSchema);
