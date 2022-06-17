// tao schema cho questions
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Question = new Schema({
    answers: {type: Array},
    text: { type: String },
    correctAnswer: { type: Number },
}, {
    timestamps:true
})

module.exports = mongoose.model('question', Question);  