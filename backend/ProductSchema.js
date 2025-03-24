const { Schema, model } = require('mongoose');

const ProductDB = new Schema({
  name: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
});
module.exports = model('ProductDB', ProductDB);
