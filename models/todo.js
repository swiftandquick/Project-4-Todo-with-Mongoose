const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TodoSchema = new Schema({
    content: {
        type: String,
        required: [true, "A Todo item must have contents."]
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Todo', TodoSchema);