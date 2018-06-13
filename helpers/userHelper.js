const User = require('../models/User');

const getUserId = username => {
    return new Promise((resolve, reject) => {
        User.findOne({ username }).then(user => {
            return user ? resolve(user._id) : reject(new Error('user not found'));
        }).catch(err => {
            console.log(err);
            return reject(err);
        });
    });
}

const isUserExist = username => {
    return new Promise((resolve, reject) => {
        User.findOne({ username }).then(user => {
            return resolve(user ? true : false);
        }).catch(err => {
            console.log(err);
            return reject(err);
        });
    });
}

module.exports = {
    getUserId,
    isUserExist
};