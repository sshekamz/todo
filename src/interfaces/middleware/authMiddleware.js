const passport = require('passport');

const authenticate = passport.authenticate('jwt', { session: false });

const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
};

module.exports = { authenticate, authorize };
