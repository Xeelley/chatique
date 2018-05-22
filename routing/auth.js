const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

router.post('/signup', (req, res) => {
    if (req.body.username && req.body.password) {
        const userData = {
            username: req.body.username,
            password: req.body.password,
        }
        if (userData.username.length < 5 || userData.username.length < 5) {
            return sendResponse(res, true, 'Username and password must contain 5+ characters');
        }
        User.findOne({ username: userData.username })
        .then(user => {
            if (user) {
                return sendResponse(res, true, 'User with this username is already exist');
            } else {
                User.create(userData, (error, user) => {
                    if (error) {
                        return sendResponse(res, error, error.message);
                    } else {
                        req.session.userId = user._id;
                        const token = require('../modules/strategy').getToken(user._id);
                        return sendResponse(res, null, { username: user.username, token });
                    }
                });
            }
        })
        .catch(err => {
            return sendResponse(res, err, err.message);
        });
    } else {
        return sendResponse(res, true, 'Invalid data');
    }
});

router.post('/login', (req, res) => {
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, (error, user) => {
            if (error || !user) {
                return sendResponse(res, true, 'Wrong email or password');
            } else {
                req.session.userId = user._id;
                const token = require('../modules/strategy').getToken(user._id);
                return sendResponse(res, null, { username: user.username, token });
            }
        });
    } else if (req.body.token) {
        const userId = require('../modules/strategy').getUserIdByToken(req.body.token);
        User.findById(userId)
        .then(user => {
            if (user) {
                return sendResponse(res, null, { username: user.username, token: req.body.token });
            } else {
                return sendResponse(res, true, 'User not found');
            }
        })
        .catch(err => {
            return sendResponse(res, err, err.message);
        });
    } else {
        return sendResponse(res, true, 'Invalid data');
    }
});


// GET for logout logout
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy((err) => {
        if (err) {
            return sendResponse(res, err, err.message);
        } else {
            return sendResponse(res);
        }
        });
    }
});

const sendResponse = (res, err, msg) => {
    res.json({
        success: err ? false : true,
        message: msg
    });
};

module.exports = router;