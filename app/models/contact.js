'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var ContactSchema = new Schema({
  email:  {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String
  },
  city: {
    type: String
  },
  phone: {
    type: String,
  },
  company: {
    type: String,
  },
  user: {
    type: ObjectId,
    ref : 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// compile User model
module.exports = mongoose.model('Contact', ContactSchema);
