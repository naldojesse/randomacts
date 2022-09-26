const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const ActSchema = new mongoose.Schema({
  title: String,
  users: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  user_ratings: [Number],
  avg_rating: Number,
  approval_rating: [Number],
  avg_approval: Number,
  approval: Boolean,

});

module.exports = mongoose.model('Act', ActSchema);