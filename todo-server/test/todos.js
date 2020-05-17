process.env.PORT = 3000;

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const app = require('../app').app;
const server = require('../app').server;

const Todo = require('../models/todo.model');

const should = chai.should();

chai.use(chaiHttp);

faker.locale = 'en_US';

describe('Todos', function () {
  // Delete and populate database before tests
  before(function () {
    console.log('before');
    return Todo.deleteMany({}).then(() => {
      const authors = Array(10)
        .fill()
        .map(() => ({
          title: faker.name.title(),
          description: faker.lorem.sentence(),
          completed: faker.random.boolean(),
        }));

      return Todo.create(authors);
    });
  });

  after(function (done) {
    console.log('after');
    mongoose.deleteModel(/.+/);
    server.close();
    done();
  });

  describe('GET requests', function () {
    it('should get list of todos', function () {
      return chai
        .request(app)
        .get('/todos')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.forEach((todo) => {
            todo.should.be.a('object');
            todo.should.have.property('title');
            todo.should.have.property('description');
            todo.should.have.property('completed');
          });
        });
    });

    it('should get filtered list of todos', function () {
      return chai
        .request(app)
        .get('/todos?visibility=completed')
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.forEach((todo) => {
            todo.should.be.a('object');
            todo.should.have.property('title');
            todo.should.have.property('description');
            todo.should.have.property('completed').eql(true);
          });
        });
    });

    // should get todo by ID

    // should not find todo by ID after deleting it

    // should not get todo with invalid ID
  });

  describe('POST requests', function () {
    it('should store todo', function () {
      const todo = {
        title: faker.name.title(),
        description: faker.lorem.sentence(),
        completed: faker.random.boolean(),
      };

      return chai
        .request(app)
        .post('/todos/store')
        .send(todo)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('description');
          res.body.should.have.property('completed');
        });
    });

    it('should not store todo without title, description and completed', function () {
      const todo = {};

      return chai
        .request(app)
        .post('/todos/store')
        .send(todo)
        .then((res) => {
          res.should.have.status(422);
          res.body.should.have.property('errors');
          res.body.errors.should.be.an('array');

          res.body.errors.forEach((error) => {
            error.should.have.property('msg');
            error.should.have.property('param');
          });
        });
    });
  });

  describe('PUT requests', function () {
    it("should update todo", function () {
      const newTitle = faker.name.title();
      const newDescription = faker.lorem.sentence();
      const newCompleted = faker.random.boolean();

      return Todo.findOne()
        .then(({ _id }) =>
          chai
            .request(app)
            .put(`/todos/${_id}/update`)
            .send({ title: newTitle, description: newDescription, completed: newCompleted })
        )
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title').eql(newTitle);
          res.body.should.have.property('description').eql(newDescription);
          res.body.should.have.property('completed').eql(newCompleted);
        });
    });
  });

  describe('DELETE requests', function () {
    it('should delete todo by ID', function () {
      return Todo.findOne()
        .then(({ _id }) => chai.request(app).delete(`/todos/${_id}/delete`))
        .then((res) => {
          res.should.have.status(204);
          res.body.should.be.eql({});
        });
    });
  });
});
