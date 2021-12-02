const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Account = new Schema({
  username: String,
  password: String,
 
}, {timestamps: true});

mongoose.model('User', Account);