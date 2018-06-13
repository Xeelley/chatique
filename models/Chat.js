const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    users: [{
        type: String
    }]
}, {
    collection: 'chats'
});

const Chat = mongoose.model('Chat', ChatSchema);
module.exports = Chat;