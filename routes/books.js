const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;

// get all books 
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
              [Sequelize.Op.ne]: null
            },
            returned_on: {
              [Sequelize.Op.eq]: null
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



    // overdue books
    router.get('/overdue_books', (req, res, next) => {

      Book.findAll({
        include: [
          {
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


    // new book

    router.get('/new_book', (req, res) => {
      console.log('💩💩💩💩💩💩')
      res.render('new_book', { pageTitle: 'New book' });
    });

      module.exports = router;




