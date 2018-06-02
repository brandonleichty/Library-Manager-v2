const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;



// Get all loans
router.get('/', function (req, res, next) {

  Loan.findAll({
      include: [Book, Patron]
    })
    .then(function (results) {
      res.render('all_loans', {
        loans: results,
        pageTitle: 'Loans'
      });
    });
});



// Return book form page
router.get('/return/:id', async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  const [book, patron] = await Promise.all([Book.findById(loan.book_id), Patron.findById(loan.patron_id)]);
  if (loan) {
    res.render('return_book', {
      loan,
      patron,
      book,
      title: 'Return book',
      today: moment().format('YYYY-MM-DD')
    });
  } else {
    res.sendStatus(404);
  }
});



// Return loan
router.post('/return/:id', (req, res, next) => {

  Loan.findById(req.params.id)
    .then((loan) => { // update loan record
      return loan.update(req.body);
    })
    .then((loan) => { // redirect to loan listing page
      res.redirect('/loans');
    })
    .catch((err) => { // handle any errors
      if (err.name === 'SequelizeValidationError') {
        renderReturnLoan(req, res, err);
      } else res.sendStatus(500);
    });
});


// Get overdue loans
router.get('/overdue_loans', function (req, res, next) {
  Loan.findAll({
      include: [Book, Patron],
      where: {
        return_by: {
          [Op.lt]: new Date()
        },
        returned_on: null
      }
    })
    .then(function (loans) {
      res.render('all_loans', {
        loans,
        pageTitle: 'Overdue Loans',
      });
    });
});


// Get checked out loans
router.get('/checked_loans', (req, res) => {
  Loan.findAll({
      include: [Book, Patron],
      where: {
        returned_on: {
          [Op.eq]: null
        }
      }
    })
    .then(function (loans) {
      res.render('all_loans', {
        loans,
        pageTitle: 'Checked Loans',
      });
    });
});



// New loan
router.get('/new_loan', (req, res) => {

  const loan = Loan.build({
    loaned_on: moment().format('YYYY-MM-DD'),
    return_by: moment().add(7, 'days').format('YYYY-MM-DD')
  });

  Book.findAll()
    .then((books) => {
      Patron.findAll() // get all the patrons
        .then((patrons) => {
          res.render('new_loan', { // render the new loan form
            loan: Loan.build({
              loaned_on: moment().format('YYYY-MM-DD'),
              return_by: moment().add(7, 'days').format('YYYY-MM-DD')
            }),
            books,
            patrons,
            pageTitle: 'New Loan'
          });
        });
    });
});



// Save new loan
router.post('/new_loan', (req, res) => {

  Loan.create(req.body) // create a new loan and redirect
    .then((loan) => { // to loans index page
      res.redirect('/loans');
    })
    .catch((err) => { // or show error messages
      if (err.name === 'SequelizeValidationError') {
        Book.findAll() // get all the books
          .then((books) => {
            Patron.findAll() // get all the patrons
              .then((patrons) => {
                res.render('new_loan', { // render the new loan form
                  loan: Loan.build(req.body),
                  books,
                  patrons,
                  errors: err.errors,
                  pageTitle: 'New Loan'
                });
              });
          });
      }
    });
});


module.exports = router;