const express = require("express");
const userRouter = require("./routes/Users");
const messagesRouter = require("./routes/Messages");
const messageGroupsRouter = require("./routes/MessageGroups");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
require("./configs/MongoDBConnection");
const fs = require("fs");
const { errorHandler } = require("./middlewares/ErrorHandler");
const I18n = require("./locales/SimpleI18n");
const cookieParser = require("cookie-parser");
// i18n.loadTranslations("./translations"); // use this as a middleware
const app = express();
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
app.use("/users", userRouter);
app.use("/messages", messagesRouter);
app.use("/groups", messageGroupsRouter);
// Must be the last middleware
app.use(errorHandler);

module.exports = server;
