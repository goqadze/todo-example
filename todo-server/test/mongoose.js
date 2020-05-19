const mongoose = require('mongoose');
const Author = require('../models/author.model');
const Person = require('../models/person.model');
const chai = require('chai');
const faker = require('faker');

const expect = chai.expect;

describe('mongoose', () => {
  before((done) => {
    mongoose
      .connect('mongodb://localhost:27017/mongoosetestsdb', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        done();
      });
  });

  beforeEach(() => {
    mongoose.models = {};
    mongoose.modelSchemas = {};
  });

  afterEach((done) => {
    Person.deleteMany({}).then(() => Author.deleteMany({}).then(() => done()));
  });

  it('should create an author', async () => {
    const author = new Author({
      name: 'Shota Rustaveli',
      age: 40,
      books: [{ title: 'Vefxistyaosani', pages: 300 }],
    });

    const createdAuthor = await author.save();

    expect(createdAuthor).has.a.property('name').eql('Shota Rustaveli');
    expect(createdAuthor).has.a.property('books').with.property('length', 1);
  });

  it('should add a book to an author', async () => {
    const author = new Author({
      name: 'Shota Rustaveli',
      age: 40,
      books: [{ title: 'Vefxistyaosani', pages: 300 }],
    });

    const createdAuthor = await author.save();

    const books = createdAuthor.books;
    books.push({ title: 'book 2', pages: 200 });
    await createdAuthor.save();

    const updatedAuthor = await Author.findById(author._id);

    expect(updatedAuthor).to.has.a.property('books').with.property('length', 2);
  });

  it('should update an author with $inc operator', async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const author = new Author({
      name: `${firstName} ${lastName}`,
      age: 40,
      books: [{ title: faker.name.title(), pages: 300 }],
    });

    const { _id } = await author.save();

    await Author.updateOne(
      { _id },
      {
        $inc: { age: 1 },
      }
    );

    const updatedAuthor = await Author.findById(_id);

    expect(updatedAuthor).to.has.a.property('age').eql(41);
  });

  it('should remove books', async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const author = new Author({
      name: `${firstName} ${lastName}`,
      age: 40,
      books: [
        { title: faker.name.title(), pages: 300 },
        { title: faker.name.title(), pages: 303 },
        { title: faker.name.title(), pages: 100 },
        { title: faker.name.title(), pages: 130 },
      ],
    });

    const { _id } = await author.save();

    await Author.updateOne(
      { _id },
      {
        $pull: { books: { pages: { $gt: 200 } } },
      }
    );

    const updatedAuthor = await Author.findById(_id);

    expect(updatedAuthor)
      .to.have.a.property('books')
      .with.property('length', 2);
  });

  it('should not select all fields', async () => {
    await Promise.all(
      Array(20)
        .fill()
        .map(() => {
          const firstName = faker.name.firstName();
          const lastName = faker.name.lastName();
          const author = new Author({
            name: `${firstName} ${lastName}`,
            age: 40, // faker.random.number(),
            books: [
              { title: faker.name.title(), pages: 300 },
              { title: faker.name.title(), pages: 303 },
              { title: faker.name.title(), pages: 100 },
              { title: faker.name.title(), pages: 130 },
            ],
          });

          return author.save();
        })
    );

    const authors = await Author.find({}).select({ books: 0, name: 0 });

    authors.forEach((author) => {
      expect(author).to.not.have.own.property('books');
      expect(author).to.not.have.own.property('name');
      expect(author).to.have.a.property('age').eql(40);
    });
  });

  it('should create ref objects', async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const author = new Author({
      name: `${firstName} ${lastName}`,
      age: 40, // faker.random.number(),
      books: [
        { title: faker.name.title(), pages: 300 },
        { title: faker.name.title(), pages: 303 },
        { title: faker.name.title(), pages: 100 },
        { title: faker.name.title(), pages: 130 },
      ],
    });

    const createdAuthor = await author.save();

    const persons = Array(5)
      .fill()
      .map(
        () =>
          new Person({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          })
      );

    await Promise.all(persons.map((person) => person.save()));

    persons.forEach(({ _id }) => createdAuthor.fans.push(_id));

    await createdAuthor.save();

    createdAuthor.fans.forEach((fan) => {
      expect(mongoose.Types.ObjectId.isValid(fan)).to.be.true;
    });
  });

  it('should create and populate ref objects', async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const author = new Author({
      name: `${firstName} ${lastName}`,
      age: 40, // faker.random.number(),
      books: [
        { title: faker.name.title(), pages: 300 },
        { title: faker.name.title(), pages: 303 },
        { title: faker.name.title(), pages: 100 },
        { title: faker.name.title(), pages: 130 },
      ],
    });

    const createdAuthor = await author.save();

    const persons = Array(5)
      .fill()
      .map(
        () =>
          new Person({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
          })
      );

    await Promise.all(persons.map((person) => person.save()));

    persons.forEach(({ _id }) => createdAuthor.fans.push(_id));

    await createdAuthor.save();

    const author2 = await Author.findOne({}).populate('fans');

    // console.log(author2);
    author2.fans.forEach((fan) => {
      expect(mongoose.Types.ObjectId.isValid(fan)).to.be.false;
      expect(fan).to.have.a.property('firstName');
      expect(fan).to.have.a.property('lastName');
    })
  });
});
