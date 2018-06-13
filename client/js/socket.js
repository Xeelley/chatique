socket.on('chat:created', chat => {
    app.contacts.push({ username: chat.username, new: 0, id: chat.id });
});

socket.on('init', () => {
    socket.emit('chats:get', app.username);
});

socket.on('error', err => {
    app.errorMessage = err.message || err || 'Unknown error';
});