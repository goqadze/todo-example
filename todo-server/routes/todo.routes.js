const express = require('express');
const { param, body, query, validationResult } = require('express-validator');
const Todo = require('../models/todo.model');

const router = express.Router();

const todoValidator = [
  body('title')
    .exists()
    .withMessage('does not exist')
    .notEmpty()
    .withMessage('not empty error'),
  body('description').exists().notEmpty(),
  body('completed').isBoolean(),
];

router.get(
  '/',

  query('visibility').isIn(['', 'all', 'active', 'completed']),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const visibility = req.query.visibility;
    let filter = {};
    // prettier-ignore
    switch (visibility) {
      case 'all': filter = {}; break;
      case 'active': filter = { completed: false }; break;
      case 'completed': filter = { completed: true }; break;
    }

    const todos = await Todo.find(filter);
    res.json(todos);
  }
);

router.post(
  '/store',

  todoValidator,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const todo = {
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    };

    console.log(todo);

    const createdTodo = await Todo.create(todo);

    res.status(200).json(createdTodo);
  }
);

router.put(
  '/:id/update',
  param('id').isMongoId(),

  todoValidator,

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const todo = await Todo.findById(req.params.id);

    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.completed = req.body.completed;

    const updatedTodo = await todo.save();

    res.status(200).json(updatedTodo);
  }
);

router.delete('/:id/delete', param('id').isMongoId(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const result = await Todo.findByIdAndDelete(req.params.id);

  res.status(204).json(result);
});

module.exports = router;
