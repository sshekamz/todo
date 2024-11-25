class TodoUseCase {
    constructor(todoRepository) {
        this.todoRepository = todoRepository;
    }

    async createTodo(title) {
        const id = Date.now(); // Simple ID generation
        const todo = new (require('../entities/todo'))(id, title);
        await this.todoRepository.save(todo);
        return todo;
    }

    async getTodos() {
        return await this.todoRepository.getAll();
    }

    async markTodoComplete(id) {
        const todo = await this.todoRepository.getById(id);
        if (!todo) throw new Error(`Todo with ID ${id} not found`);
        todo.markComplete();
        await this.todoRepository.save(todo);
        return todo;
    }
}

module.exports = TodoUseCase;
