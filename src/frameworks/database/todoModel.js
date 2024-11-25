const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const TodoModel = mongoose.model('Todo', TodoSchema);

module.exports = TodoModel;
