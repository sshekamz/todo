const express = require('express');
const { check, validationResult } = require('express-validator');
const passport = require('passport');
const { authenticate, authorize } = require('../../interfaces/middleware/authMiddleware');
const AuthController = require('../../interfaces/controllers/authController');

class ExpressServer {
    constructor(todoController) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.todoController = todoController;
        this.authController = new AuthController();

        require('../../frameworks/auth/jwtStrategy')(passport);

        this._initializeMiddleware();
        this._setupRoutes();
        this._setupErrorHandling();
    }

    // Middleware for parsing requests
    _initializeMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(passport.initialize());
    }

    // Middleware for handling validation results
    _validationResultHandler(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }

    // Validation for signup and login routes
    _validateSignup() {
        return [
            check('username')
                .notEmpty()
                .withMessage('Username is required')
                .isString()
                .withMessage('Username must be a string')
                .trim()
                .escape(),
            check('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters long'),
            check('role')
                .optional()
                .isIn(['user', 'admin'])
                .withMessage('Invalid role'),
        ];
    }

    _validateLogin() {
        return [
            check('username')
                .notEmpty()
                .withMessage('Username is required')
                .isString()
                .withMessage('Username must be a string'),
            check('password')
                .notEmpty()
                .withMessage('Password is required'),
        ];
    }

    _validateRefreshToken() {
        return [
            check('refreshToken')
                .notEmpty()
                .withMessage('Refresh token is required'),
        ];
    }

    // Setting up application routes
    _setupRoutes() {
        // Authentication routes
        this.app.post(
            '/signup',
            this._validateSignup(),
            (req, res, next) => this._validationResultHandler(req, res, next),
            (req, res) => this.authController.signup(req, res)
        );

        this.app.post(
            '/login',
            this._validateLogin(),
            (req, res, next) => this._validationResultHandler(req, res, next),
            (req, res) => this.authController.login(req, res)
        );

        this.app.post(
            '/refresh',
            this._validateRefreshToken(),
            (req, res, next) => this._validationResultHandler(req, res, next),
            (req, res) => this.authController.refreshToken(req, res)
        );

        // Todo routes (protected)
        this.app.post(
            '/todos',
            authenticate,
            (req, res) => this.todoController.createTodoHandler(req, res)
        );

        this.app.get(
            '/todos',
            authenticate,
            (req, res) => this.todoController.getTodosHandler(req, res)
        );

        // Admin-only route example
        this.app.delete(
            '/admin/todos',
            authenticate,
            authorize(['admin']),
            (req, res) => res.json({ message: 'Admin-only action performed' })
        );

        // 404 Handler
        this.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Endpoint not found' });
        });
    }

    // Centralized error handling middleware
    _setupErrorHandling() {
        this.app.use((err, req, res, next) => {
            console.error('An error occurred:', err.message);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        });
    }

    // Starts the server
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}`);
        });
    }
}

module.exports = ExpressServer;
