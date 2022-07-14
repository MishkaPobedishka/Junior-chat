require('dotenv').config();
const io = require('socket.io')(8900, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
});

let users = [];

const addUser = (userId, socketId, online) => {
    !users.some(user => user.userId === userId) &&
        users.push({userId, socketId, online});
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const findUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on('connection', (socket) => {

    socket.on('addUser', (userId, online) => {
        console.log('user connected');
        addUser(userId, socket.id, online);
        io.emit('getUsers', users);
    })

    socket.on('requestUsers', () => {
        io.emit('getUsers', users);
    })

    socket.on('sendMessage', ({id, senderId, dialogId, receiverId, text, isRead}) => {
        const user = findUser(receiverId);
        io.to(user?.socketId).emit('getMessage', {
            id,
            senderId,
            dialogId,
            text,
            isRead,
        })
    })

    socket.on('addDialog', ({id, userId, receiverId, receiverName, lastMessage, missedMessages, createdAt}) => {
        const user = findUser(receiverId);
        io.to(user?.socketId).emit('getDialog', {
            id,
            userId,
            receiverId,
            receiverName,
            lastMessage,
            missedMessages,
            createdAt
        })
    })

    socket.on('setBlocked', ({receiverId, userName, userEmail, blockStatus}) => {
        const user = findUser(receiverId);
        io.to(user?.socketId).emit('getBlocked', {
            receiverId,
            userName,
            userEmail,
            blockStatus
        })
    })

    socket.on('disconnect', () => {
        removeUser(socket.id);
        console.log('user disconnect')
        io.emit('getUsers', users);
    })
})