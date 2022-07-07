require('dotenv').config();
const io = require('socket.io')(8900, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const findUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('addUser', userId => {
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    })

    socket.on('sendMessage', ({senderId, receiverId, text, isRead}) => {
        const user = findUser(receiverId);
        io.to(user?.socketId).emit('getMessage', {
            senderId,
            text,
            isRead,
        })
    })

    socket.on('disconnect', () => {
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})