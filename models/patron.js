'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First name is required.'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last name is required.'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Valid email is required.'
        },
        notEmpty: {
          msg: 'Email is required.'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library ID is required.'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'ZIP Code is required.'
        },
        isNumeric: {
          msg: 'ZIP Code has to be numeric.'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.Loan, { foreignKey: 'patron_id' });
      }
    },
    timestamps: false
  });
  return Patron;
};