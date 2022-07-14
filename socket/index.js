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
        io.emit('getUsers', users);
    })
})