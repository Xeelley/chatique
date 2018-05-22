const express    = require('express');
const expressApp = express();
const config     = require('./config');
const mongoose   = require('mongoose');
const http       = require('http').Server(expressApp);
const io         = require('socket.io')(http);
const path       = require('path');
const bodyParser = require('body-parser');
const session    = require('express-session');
const MongoStore = require('connect-mongo')(session);

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
const setMWs = () => {
    return new Promise((resolve, reject) => {
        expressApp.use(express.static(path.join(__dirname + '/client')));
        expressApp.use(bodyParser.json());
        expressApp.use(bodyParser.urlencoded({ extended: false }));
        const sessionSettings = Object.assign(config.sessions, { store: new MongoStore({mongooseConnection: mongoose.connection}) }); 
        expressApp.use(session(sessionSettings));
        console.log(`[SERVER] MWs started`);
        return resolve();
    });
}
const setRoutes = () => {
    return new Promise((resolve, reject) => {
        expressApp.use('/auth', require('./routing/auth'));
        expressApp.use('/', require('./routing/main'));
        console.log(`[SERVER] Routes started`);
        return resolve();
    });
}
const setIO = () => {
    return new Promise((resolve, reject) => {
        io.on('connection', socket => {
            console.log(`[IO    ] + client: ${socket.id}`);
        
            socket.on('disconnect', () => {
                console.log(`[IO    ] - client: ${socket.id}`);
            });
        });
        console.log(`[IO    ] connection started`);
        return resolve();
    });
}

loadMongoDB().then(() => {
    setMWs().then(() => {
        setRoutes().then(() => {
            setIO().then(() => {
                start();
            });
        });
    });
});

