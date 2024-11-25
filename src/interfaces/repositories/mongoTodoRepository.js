const TodoModel = require('../../frameworks/database/todoModel');

class MongoTodoRepository {
    async save(todo) {
        const existingTodo = await TodoModel.findOne({ id: todo.id });
        if (existingTodo) {
            existingTodo.title = todo.title;
            existingTodo.completed = todo.completed;
            return existingTodo.save();
        }
        const newTodo = new TodoModel(todo);
        return newTodo.save();
    }

    async getAll() {
        return TodoModel.find();
    }

    async getById(id) {
        return TodoModel.findOne({ id });
    }
}

module.exports = MongoTodoRepository;
