const {Schema, model} = require('mongoose')

const Profile = new Schema({
    login:{
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    }
  })
  module.exports = model('Profile', Profile)