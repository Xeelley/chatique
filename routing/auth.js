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
        User.create(userData, (error, user) => {
            if (error) {
                return sendResponse(res, error, error.message);
            } else {
                req.session.userId = user._id;
                return sendResponse(res);
            }
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
                return sendResponse(res);
            }
        });
    } else {
        return sendResponse(res, true, 'Invalid data');
    }
});

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
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