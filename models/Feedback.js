const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    comment: String
})

module.exports = mongoose.model('feedback', feedbackSchema);