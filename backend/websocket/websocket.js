//socket.io
const https = require("https");
const server = https.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" },
});

let users = [];
const filterUsers = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const disconnectUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

// const getUserById = (userId) => {
//     return users.find((user) => user.userId === userId);
// };
io.on("connection", (socket) => {
    socket.on("addUser", (getUserId) => {
        console.log("a user connected.");
        filterUsers(getUserId, socket.id);
        io.emit("getUsers", users);
        console.log(users);
    });

    socket.on("disconnect", () => {
        disconnectUser(socket.id);
        io.emit("getUsers", users);
        console.log("a user disconnect.");
    });

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
    });

    socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
    });

    socket.on("sendGroupMessage", ({ senderId, groupId, message, createdAt }) => {
        socket.to(groupId).emit("getGroupMessage", {
            groupId: groupId,
            senderId: senderId,
            message: message,
            createdAt: createdAt,
        });

        //     if (getUserById(receiverId)) {
        //         const { socketId } = getUserById(receiverId);
        //         io.to(socketId).emit("getPrivateMessage", {
        //             senderId,
        //             message,
        //         });
    });
});

module.exports = server;
