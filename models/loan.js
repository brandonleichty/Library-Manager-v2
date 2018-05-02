'use strict';
module.exports = function(sequelize, DataTypes) {
  var Loan = sequelize.define('Loan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book ID is required.'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron ID is required.'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Loaned on Date is required.'
        },
        isDate: {
          msg: 'Loaned on Date must be a valid date.'
        }
      }
    },
    return_by: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Return by Date is required.'
        },
        isDate: {
          msg: 'Return by Date must be a valid date.'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATEONLY,
      validate: {
        notEmpty: {
          msg: 'Return by Date is required.'
        },
        isDate: {
          msg: 'Return by Date must be a valid date.'
        }
      }
    }
  }, {
    timestamps: false
  });

  Loan.associate = function(models) {
    Loan.belongsTo(models.Book, { foreignKey: 'book_id' });
    Loan.belongsTo(models.Patron, { foreignKey: 'patron_id' });
}
  return Loan;
};