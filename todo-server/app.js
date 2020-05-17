const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload'); // import fileUpload from 'express-fileupload';
const cors = require('cors');
const todoRoutes = require('./routes/todo.routes');

const app = express();
/**
 * CRUD example (Create, Read, Update, Delete)
 *
 * Http methods (Post,   Get,  Put,    Delete)
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// fileUpload - content type multipart/form-data -ისთვის, რაც პოსტმენით მოყვებოდა
app.use(fileUpload());
// ჩვენი კლიენტიდან content-type: application/json-ს ვატნევთ, api/index.js ფაილში ნახავთ

app.use(cors());

const mongoUrl = 'mongodb://localhost:27017/todosdb';

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(() => {
    console.error('Unable to connect to MongoDB');
  });

app.use('/todos', todoRoutes);

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = { app, server };
