const express = require("express");
const userRouter = require("./routes/Users");
const messagesRouter = require("./routes/Messages");
const messageGroupsRouter = require("./routes/MessageGroups");
const helmet = require("helmet");
const https = require("http");
const cors = require("cors");
require("./configs/MongoDBConnection");
const fs = require("fs");

const app = express();
const server = https.createServer(
    {
        // key: fs.readFileSync("../certs/mykey.key"),
        // cert: fs.readFileSync("../certs/mykey.crt"),
    },
    app
);
const cookieParser = require("cookie-parser");

app.use(helmet());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: ["https://real-time-chat-app-frontend-eight.vercel.app"],
    })
);
app.use(express.json());

app.use("/users", userRouter);
app.use("/messages", messagesRouter);
app.use("/groups", messageGroupsRouter);

module.exports = server;
