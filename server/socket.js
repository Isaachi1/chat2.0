const server = require('./http');
const socket = require('socket.io')(server);
const clients = [];

const userExists = name => clients.filter(c => c !== null).findIndex(c => c.name === name) >= 0;
const typing = (client, isTyping) => {
    const index = clients.filter(c => c !== null).findIndex(c => c.id == client.id);
    if(index >= 0) clients[index].typing = isTyping;
};
const getUser = id => clients.find(c => c.id === id) || false;
const addUser = (name, client) => {
    if (name && name.length > 0) {
        const user = {
            name: name || '',
            id: client.id,
            date: new Date(),
            typing: false
        };

        clients.push(user);

        return user;
    }
};
const removeUser = user => {
    const index = clients.findIndex(c => c.id == user.id);
    clients.splice(index, 1);
};

socket.on('connection', client => {
    const updateUsers = () => socket.sockets.emit('updateUsers', clients);

    client.on('login', name => {
        if (name == null || name.length <= 0) return;
        name = name.substr(0, 20);
        if (userExists(name)) {
            client.emit('chatError', `Nome de usuário já existente.`)
        } else {
            const user = addUser(name, client);
            socket.sockets.emit('log', `${user.name} entrou no chat.`);
            updateUsers();
        }
    });

    client.on('disconnect', () => {
        const user = getUser(client.id);
        socket.sockets.emit('log', `${user.name} saiu do chat.`);
        removeUser(user);
        updateUsers();
    });

    client.on('message', msg => {
        console.log(msg);
        socket.sockets.emit('message', msg);
    });
    client.on('typing', () => {
        typing(client, true);
        updateUsers();
    });
    client.on('stop-typing', () => {
        typing(client, false);
        updateUsers();
    });
});