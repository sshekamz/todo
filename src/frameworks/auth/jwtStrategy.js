const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserModel = require('../database/UserModel');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'default_secret', // Use an environment variable for production
};

const strategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await UserModel.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

module.exports = (passport) => {
    passport.use(strategy);
};
