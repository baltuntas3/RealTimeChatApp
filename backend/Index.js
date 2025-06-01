const express = require("express");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const messagesRouter = require("./routes/Messages");
const messageGroupsRouter = require("./routes/MessageGroups");
const http = require("http");
const {Server} = require("socket.io");
const cors = require("cors");
require("./configs/MongoDBConnection");
// const fs = require("fs");
const {errorHandler} = require("./middlewares/ErrorHandler");
const I18n = require("./locales/SimpleI18n");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middlewares/Auth");
const helmet = require("helmet");

// Express app oluştur
const app = express();

// HTTP server oluştur
const server = http.createServer(
    // {
    //     // key: fs.readFileSync("../certs/mykey.key"),
    //     // cert: fs.readFileSync("../certs/mykey.crt"),
    // },
    app
);

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
    console.log("Yeni bir kullanıcı bağlandı:", socket.id);

    socket.on("addUser", (getUserId) => {
        console.log("Kullanıcı eklendi:", getUserId);
        filterUsers(getUserId, socket.id);
        io.emit("getUsers", users);
        console.log("Aktif kullanıcılar:", users);
    });

    socket.on("disconnect", () => {
        disconnectUser(socket.id);
        io.emit("getUsers", users);
        console.log(socket.id + " kullanıcısı ayrıldı.");
    });

    socket.on("joinGroup", (groupId) => {
        socket.join(groupId);
        console.log(`Kullanıcı ${socket.id} gruba katıldı: ${groupId}`);
    });

    socket.on("leaveGroup", (groupId) => {
        socket.leave(groupId);
        console.log(`Kullanıcı ${socket.id} gruptan ayrıldı: ${groupId}`);
    });

    socket.on("sendGroupMessage", ({senderId, groupId, message, createdAt}) => {
        io.in(groupId).emit("getGroupMessage", {
            groupId: groupId,
            senderId: senderId,
            message: message,
            createdAt: createdAt,
        });
        console.log(`Grup mesajı gönderildi - Grup: ${groupId}, Gönderen: ${senderId}`);
    });

    socket.on("sendPrivateMessage", ({senderId, receiverId, message, createdAt}) => {
        const receiver = users.find((user) => user.userId === receiverId);
        if (receiver) {
            io.to(receiver.socketId).emit("getPrivateMessage", {
                senderId: senderId,
                message: message,
                createdAt: createdAt,
            });
            console.log(`Özel mesaj gönderildi - Gönderen: ${senderId}, Alan: ${receiverId}`);
        }
    });

    socket.on("userOnline", (userId) => {
        socket.broadcast.emit("userStatusChanged", {userId, status: "online"});
    });

    socket.on("userOffline", (userId) => {
        socket.broadcast.emit("userStatusChanged", {userId, status: "offline"});
    });
});

app.use(helmet());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: "http://localhost:3000",
    })
);
app.use(express.json());

app.use((req, res, next) => I18n.init(req, res, next));

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/messages", verifyToken, messagesRouter);
app.use("/groups", messageGroupsRouter);

app.use(errorHandler);

module.exports = {server, io, app};
