const {server} = require("../Index");
const {Server} = require("socket.io");
const logger = require('../configs/Logger');
// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

let users = [];

const filterUsers = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId});
};

const disconnectUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

// Socket.io event handlers
io.on("connection", (socket) => {
    logger.logWebSocket('User connected', { socketId: socket.id });

    socket.on("addUser", (getUserId) => {
        logger.logWebSocket('User added', { userId: getUserId, socketId: socket.id });
        filterUsers(getUserId, socket.id);
        io.emit("getUsers", users);
        logger.debug('Active users updated', { activeUsers: users.length, users: users.map(u => u.userId) });
    });

    socket.on("disconnect", () => {
        disconnectUser(socket.id);
        io.emit("getUsers", users);
        logger.logWebSocket('User disconnected', { socketId: socket.id });
    });

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        logger.logWebSocket('User joined group', { socketId: socket.id, groupId });
    });

    socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
        logger.logWebSocket('User left group', { socketId: socket.id, groupId });
    });

    socket.on("sendGroupMessage", ({senderId, groupId, message, createdAt}) => {
        io.in(groupId).emit("getGroupMessage", {
            groupId: groupId,
            senderId: senderId,
            message: message,
            createdAt: createdAt,
        });
        logger.logWebSocket('Group message sent', { groupId, senderId });
    });

    socket.on("sendPrivateMessage", ({senderId, receiverId, message, createdAt}) => {
        const receiver = users.find((user) => user.userId === receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getPrivateMessage", {
                senderId: senderId,
                message: message,
                createdAt: createdAt,
            });
            logger.logWebSocket('Private message sent', { senderId, receiverId });
        }
    });

    socket.on("userOnline", (userId) => {
        socket.broadcast.emit("userStatusChanged", {userId, status: "online"});
    });

    socket.on("userOffline", (userId) => {
        socket.broadcast.emit("userStatusChanged", {userId, status: "offline"});
    });
});
