const Chat = require('../helpers/chatHelper');
const User = require('../helpers/userHelper');

module.exports = socket => {
    console.log(`[IO    ] + client: ${socket.id}`);
        
    socket.on('disconnect', () => {
        console.log(`[IO    ] - client: ${socket.id}`);
    });

    socket.on('chat:new', usernames => {
        User.isUserExist(usernames[0]).then(exist => {
            if (!exist) {
                return Promise.reject(new Error('Invalid username'));
            } else {
                return Chat.createNewChat(usernames[0], usernames[1]);
            }
        }).then(id => {
            socket.emit('chat:new:res', Response(null, { username: usernames[0], id }));
        }).catch(err => {
            socket.emit('chat:new:res', Response(err));
        });
    });
}

const Response = (err, data) => {
    return {
        success: err ? false : true,
        data,
        error: err ? (err.message || err || 'Unknown error') : null
    };
}
