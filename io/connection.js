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
            socket.join(id);
            IO.to(id).emit('chat:created', { username: usernames[0], id });
        }).catch(err => {
            socket.emit('error', err);
        });
    });

    socket.on('message:new', data => {
        IO.to(data.chatId).emit('message', {
            text: data.message,
            author: data.author
        });
    });

    socket.on('message:many', data => {
        console.log(data);
        setTimeout(() => {
            data.messages.forEach(message => {
                IO.to(data.chatId).emit('message', {
                    text: message,
                    author: data.author
                });
            }, this);
        }, 3000);
    });
}

