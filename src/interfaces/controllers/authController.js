const jwt = require('jsonwebtoken');
const UserModel = require('../../frameworks/database/UserModel');

class AuthController {
    async signup(req, res) {
        try {
            const { username, password, role } = req.body;
            const user = new UserModel({ username, password, role });
            await user.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await UserModel.findOne({ username });
            if (!user || !(await user.comparePassword(password))) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'default_secret', {
                expiresIn: '1h',
            });

            res.status(200).json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;
