const mongoose = require('mongoose');
var passwordLocalMongoose = require('passport-local-mongoose');

var CollectorUser = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: String,
  password: {
    type: String,
  },
  profileimg: String,
});

CollectorUser.plugin(passwordLocalMongoose);

module.exports = mongoose.model('Collector', CollectorUser);
