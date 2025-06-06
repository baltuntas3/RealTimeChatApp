const express = require("express");
const userRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const messagesRouter = require("./routes/Messages");
const messageGroupsRouter = require("./routes/MessageGroups");
const http = require("http");

const cors = require("cors");
require("./configs/MongoDBConnection");
// const fs = require("fs");
const {errorHandler, notFoundHandler} = require("./middlewares/ErrorHandler");
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

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/messages", verifyToken, messagesRouter);
app.use("/groups", messageGroupsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = {server, app};
