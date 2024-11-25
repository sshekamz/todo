class TodoController {
    constructor(todoUseCase) {
        this.todoUseCase = todoUseCase;
    }

    async createTodoHandler(req, res) {
        try {
            const todo = await this.todoUseCase.createTodo(req.body.title);
            res.status(201).json(todo);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getTodosHandler(req, res) {
        try {
            const todos = await this.todoUseCase.getTodos();
            res.status(200).json(todos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TodoController;
