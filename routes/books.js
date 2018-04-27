const express = require('express');
const router = express.Router();

const Books = require('../models').Book;

// route: /books
router.get('/', (req, res) => {
  Books.findAndCountAll()
  .then((results) => {
    res.render('books', { books: results, pageTitle: 'Books',
      });
  });
});

module.exports = router;