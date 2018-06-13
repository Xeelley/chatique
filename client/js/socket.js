socket.on('chat:new:res', data => {
    if (data.success) {
      app.contacts.push({ username: data.data.username, new: 0, id: data.data.id });
    } else {
      app.errorMessage = data.error;
    }
});