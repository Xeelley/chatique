const passportJWT = require('passport-jwt');
const User        = require('../models/User');
const jwt         = require('jsonwebtoken');
const config      = require('../config');
const ExtractJwt  = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const strategy = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.strategy.key
}, (jwt_payload, next) => {
    User.findById(jwt_payload.id)
    .then(user => {
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    })
    .catch(err => {
        console.log(err);
        next(err, false);
    });
});

const getToken = id => {
    return jwt.sign({ id }, config.strategy.key);
};

const getUserIdByToken = token => {
    return jwt.verify(token, config.strategy.key).id;
}

module.exports = {
    strategy,
    getToken,
    getUserIdByToken
};