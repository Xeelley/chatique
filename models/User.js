const mongoose = require('mongoose');
const schema = mongoose.Schema({
    chat_id: {
        type: String,
        require: true,
        unique: true
    },
    user: {
        type: Object,
        require: true
    }
}, { collection: 'users' });
const Model = mongoose.model('User', schema);

module.exports = Model;