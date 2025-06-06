const {server} = require("../Index");
const {Server} = require("socket.io");
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
