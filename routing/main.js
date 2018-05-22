const router = require('express').Router();
const path   = require('path');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/index.html'));
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;