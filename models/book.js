'use strict';
module.exports = function(sequelize, DataTypes) {
  var Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required.'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author is required.'
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre is required.'
        }
      }
    },
    first_published: DataTypes.INTEGER
  }, {
    timestamps: false
  });

  Book.associate = function(models) {
    Book.hasMany(models.Loan, { foreignKey: 'book_id' });
}
  return Book;
};