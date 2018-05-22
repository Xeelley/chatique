const express    = require('express');
const expressApp = express();
const config     = require('./config');
const mongoose   = require('mongoose');
const http       = require('http').Server(expressApp);
const io         = require('socket.io')(http);
const path       = require('path');

//  CONFIGURE
expressApp.use(express.static(path.join(__dirname + '/client')));

// ROUTES
expressApp.use('/', require('./routing/main'));

// IO
io.on('connection', socket => {
    console.log(`[IO    ] + client: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`[IO    ] - client: ${socket.id}`);
    });
});
console.log(`[IO    ] connection started`);


// START
const loadMongoDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(config.mongodb.uri, config.mongodb.settings)
        .then(res => {
            console.log('[MONGO ] Connection success');
            return resolve();
        })
        .catch(err => {
            console.log(err);
            console.log('[MONGO ] Connection failed');
            return reject();
        });
    });
}
const start = () => {
    http.listen(config.port, () => {
        console.log(`[SERVER] Server started on ${config.port} port`);
    });   
}

loadMongoDB().then(() => {
    start();
});

