const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Book = require('../models').Book;
const Loan = require('../models').Loan;
const Patron = require('../models').Patron;






// Get all patrons
router.get('/', (req, res, next) => {

  Patron.findAndCountAll()
    .then((results) => {
      res.render('all_patrons', {
        patrons: results.rows,
        pageTitle: 'Patrons'
      });
    });
});

// New patron
router.get('/new_patron', (req, res) => {
  try {
    res.render('new_patron', {
      patron: Patron.build(),
      pageTitle: 'New Patron'
    });
  } catch (err) {
    console.log(err);
  }
});


// Create a new patron
router.post('/new_patron', (req, res) => {
  Patron.create(req.body)
    .then(patron => {
      res.redirect('/patrons');
    })
    .catch(err => {
      if (err.name === 'SequelizeValidationError') {
        res.render('new_patron', {
          patron: Patron.build(req.body),
          pageTitle: 'New Patron',
          errors: err.errors
        });
      } else {
        throw err;
      }
    });
});


// Get patron details
router.get('/details/:id', (req, res, next) => {

  Patron.findById(req.params.id)
    .then((patron) => {
      Loan.findAll({
          include: [Book, Patron],
          where: {
            patron_id: patron.id
          }
        })
        .then((loans) => {
          res.render('patron_details', {
            patron,
            loans,
          });
        });
    });
});


// Edit patron details
router.post('/details/:id', (req, res) => {

  Patron.findById(req.params.id)
    .then((patron) => { // update patron record
      return patron.update(req.body)
    })
    .then((patron) => { // redirect to book listing page
      res.redirect('/patrons')
    })
    .catch((err) => { // handle validation errors
      if (err.name === 'SequelizeValidationError') {
        Patron.findById(req.params.id)
          .then((patron) => {
            Loan.findAll({
                include: [Book, Patron],
                where: {
                  patron_id: patron.id
                }
              })
              .then((loans) => {
                res.render('patron_details', {
                  patron: Patron.build(req.body),
                  loans,
                  errors: err.errors,
                });
              });
          });
      } else res.send(500);
    });
});

module.exports = router;