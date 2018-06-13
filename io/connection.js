const Chat = require('../helpers/chatHelper');
const User = require('../helpers/userHelper');
const IO   = require('../index').io;

module.exports = socket => {

    console.log(`[IO    ] + client: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`[IO    ] - client: ${socket.id}`);
    });
    socket.emit('init');

    socket.on('chats:get', username => {
        Chat.getChatsForUser(username).then(chats => {
            chats.forEach(chat => {
                socket.emit('chat:created', chat);
                socket.join(chat.id);
            }, this);
        }).catch(err => {
            socket.emit('error', err);
        });
    });
        
    socket.on('chat:new', usernames => {
        User.isUserExist(usernames[0]).then(exist => {
            if (!exist) {
                return Promise.reject(new Error('Invalid username'));
            } else {
                return Chat.createNewChat(usernames[0], usernames[1]);
            }
        }).then(id => {
            socket.emit('chat:created', { username: usernames[0], id });
        }).catch(err => {
            socket.emit('error', err);
        });
    });
}

