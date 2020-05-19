const { model, Schema } = require('mongoose');

const bookSchema = new Schema({
  title: String,
  pages: Number,
});

const authorSchema = new Schema({
  name: String,
  age: Number,
  books: [bookSchema],
  fans: [{ type: Schema.Types.ObjectId, ref: 'persons' }],
});

module.exports = model('authors', authorSchema);
