module.exports = {
    port: 8080,
    mongodb: {
        uri: 'mongodb://localhost/chatiqueue',
        settings: {
            autoIndex: true, 
            reconnectTries: Infinity,
            reconnectInterval: 2000, 
            poolSize: 10, 
            bufferMaxEntries: 0,
        }
    },
    sessions: {
        secret: 'yutbgfuhc4u95845ugi',
        resave: true,
        saveUninitialized: false
    },
    strategy: {
        key: 'huusajksddf34'
    }
};