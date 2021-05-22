const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  about: {
    type: String,
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  avatar:{
    type: String,
    required: true,
  }
})

module.exports = mongoose.model('user', userSchema);