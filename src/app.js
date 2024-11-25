const MongoDBConnection = require('./frameworks/database/dbConn');
const MongoTodoRepository = require('./interfaces/repositories/mongoTodoRepository');
const TodoUseCase = require('./usecases/todoUsecase');
const TodoController = require('./interfaces/controllers/todoController');
const ExpressServer = require('./frameworks/web/expressServer');


(async () => {
    try {
        // Connect to MongoDB
        await MongoDBConnection.connect('mongodb://localhost:27017/todos');

        // Initialize dependencies
        const todoRepository = new MongoTodoRepository();
        const todoUseCase = new TodoUseCase(todoRepository);
        const todoController = new TodoController(todoUseCase);

        // Start the server
        const server = new ExpressServer(todoController);
        server.start();
    } catch (error) {
        console.error('Failed to start the application:', error);
    }
})();
