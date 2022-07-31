const mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
  pname: String,
  size: String,
  height: String,
  width: String,
  weight: String,
  author: String,
  address: String,
  mobile: String,
  // author: {
  //   id: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'User',
  //   },
  //   username: String,
  //   email: String,
  // },
});

module.exports = mongoose.model('Request', requestSchema);
