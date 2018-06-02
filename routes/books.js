const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

// Get all books
router.get('/', (req, res) => {
  Book.findAndCountAll()
    .then((bookResults) => {
      res.render('books', {
        books: bookResults.rows,
        pageTitle: 'Books',
      });
    });
});



// Display checked out books:
router.get('/checked_out', (req, res, next) => {

  Book.findAll({
    include: [{
      model: Loan,
      where: {
        loaned_on: {
          [Op.ne]: null
        },
        returned_on: {
          [Op.eq]: null
        }
      }
    }]
  }).then((results) => {
    res.render('books', {
      books: results,
      pageTitle: 'Checked out books',
    });
  });
});



// Overdue books
router.get('/overdue_books', (req, res, next) => {

  Book.findAll({
    include: [{
      model: Loan,
      where: {
        return_by: {
          [Sequelize.Op.lt]: new Date()
        },
        returned_on: null
      }
    }]
  }).then((results) => {
    res.render('books', {
      books: results,
      pageTitle: 'Overdue out books',
    });
  });
});


// Get new book route

router.get('/new_book', (req, res) => {
  res.render('new_book', {
    book: Book.build(),
    pageTitle: 'New book'
  });
});


// New book

router.post('/new_book', (req, res) => {
  Book.create(req.body)
    .then(book => {
      res.redirect('/books');
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('new_book', {
          book: Book.build(req.body),
          title: 'New book',
          errors: err.errors
        });
      } else {
        throw err;
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});


// Get book details page
router.get('/details/:id', function (req, res, next) {
  Book.findById(req.params.id, {
    include: [{
      model: Loan,
      include: [{
        model: Patron
      }]
    }]
  }).then(function (results) {
    if (results) {
      res.render('book_details', {
        book: results,
        title: results.title
      });
    } else {
      res.sendStatus(404);
    }
  });
});




// Post edited book details
router.post('/details/:id', (req, res, next) => {

  Book.findById(req.params.id)
    .then((book) => { // update book record
      return book.update(req.body)
    })
    .then((book) => { // redirect to book listing page
      res.redirect('/books')
    })
    .catch((err) => { // handle validation errors
      if (err.name === 'SequelizeValidationError') {
        Book.findById(req.params.id, {
          include: [{
            model: Loan,
            include: [{
              model: Patron
            }]
          }]
        }).then(function (results) {
          if (results) {
            res.render('book_details', {
              book: results,
              title: results.title,
              errors: err.errors,
            });
          } else {
            res.sendStatus(404);
          }
        })
      }
    })
});



// Return book
router.put('/details/:id/return', function (req, res, next) {

  console.log('YAYYYY');

  Loan.update({
    returned_on: req.body.returned_on,
  }, {
    where: {
      book_id: req.params.id
    }
  }).then((results) => {
    res.redirect('/books');
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      console.log('poop');
    }
  });
});


module.exports = router;