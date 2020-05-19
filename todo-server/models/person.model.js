const { model, Schema } = require('mongoose');

const personSchema = new Schema({
  firstName: String,
  lastName: String,
});

module.exports = model('persons', personSchema);
