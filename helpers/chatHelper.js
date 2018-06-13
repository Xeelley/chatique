const Chat = require('../models/Chat');

const getChatIDsForUser = username => {
    return new Promise((resolve, reject) => {
        Chat.find({ users: username }).then(chats => {
            let chatIds = [];
            chats.forEach(chat => {
                chatIds.push(chat._id);
            }, this);
            return resolve(chatIds);
        }).catch(err => {
            console.log(err);
            return reject(err); 
        });
    });
}

const createNewChat = (username1, username2) => {
    return new Promise((resolve, reject) => {
        Chat.findOne({ users: { $all: [ username1, username2 ] } }).then(chat => {
            if (chat) {
                console.log(chat);
                return Promise.resolve(chat);
            } else {
                return Chat.create({
                    users: [username1, username2]
                });
            }
        }).then(chat => {
            console.log(chat);
            return resolve(chat._id);
        }).catch(err => {
            console.log(err);
            return reject(err);
        });
    });
}

const getChatID = (username1, username2) => {
    return new Promise((resolve, reject) => {
        Chat.find({ users: { $all: [ username1, username2 ] } }).then(chat => {
            return chat ? resolve(chat._id) : reject(new Error('chat not found')); 
        }).catch(err => {
            console.log(err);
            return reject(err);
        });
    });
}

module.exports = {
    getChatIDsForUser,
    createNewChat,
    getChatID
};