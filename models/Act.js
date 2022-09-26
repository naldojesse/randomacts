const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actsSchema = new Schema({
  title: String,
  users: [{type: Schema.Types.ObjectId, ref: 'user'}],
  user_ratings: [Number],
  avg_rating: Number,
  created_at: {Date, default: Date.now},

  approval_rating: [Number],
  avg_approval: Number,
  approval: Boolean,

});

module.exports = mongoose.model('act', actsSchema);