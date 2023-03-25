const express = require("express");
const userRouter = require("./routes/Users");
const messagesRouter = require("./routes/Messages");
const messageGroupsRouter = require("./routes/MessageGroups");

const cors = require("cors");
require("./configs/MongoDBConnection");
const app = express();
const cookieParser = require("cookie-parser");
//socket.io
const http = require("http");
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: { origin: "*" },
});

app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

//socket.io implementation begin
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

    socket.on("sendGroupMessage", ({ senderId, groupId, message }) => {
        socket.to(groupId).emit("getGroupMessage", {
            senderId: senderId,
            message: message,
        });

        //     if (getUserById(receiverId)) {
        //         const { socketId } = getUserById(receiverId);
        //         io.to(socketId).emit("getPrivateMessage", {
        //             senderId,
        //             message,
        //         });
    });
});
//socket.io implementation end

app.use("/users", userRouter);
app.use("/messages", messagesRouter);
app.use("/groups", messageGroupsRouter);

server.listen(3005, () => {
    console.log("listening on *:3005");
});

app.listen(5000, () => {
    console.log("Server is listening...");
});
