socket.on('chat:created', chat => {
    app.contacts.push({ username: chat.username, new: 0, id: chat.id });
});

socket.on('init', () => {
    app.contacts = [];
    socket.emit('chats:get', app.username);
});

socket.on('error', err => {
    app.errorMessage = err.message || err || 'Unknown error';
});

socket.on('message', message => {
    if (message.author === app.username) {
        app.messages.push({
            text: message.text,
            type: 'from'
        });
    } else {
        app.contacts.forEach(contact => {
            if (contact.username === message.author) {
                if (app.currentChat === contact.id) {
                    app.messages.push({
                        text: message.text,
                        type: 'to'
                    });
                } else {
                    contact.new++;
                }
            }
        }, this);
    }
});

socket.on('connect_error', () => {
    app.offline = true;
    app.errorMessage = 'Connection error';
});

socket.on('connect', () => {
    app.offine = false;
    if (OffineMessages.get().length !== 0) {
        socket.emit('message:many', {
            author: app.username,
            messages: OffineMessages.get(),
            chatId: app.currentChat
        });
        OffineMessages.clear();
    }
});