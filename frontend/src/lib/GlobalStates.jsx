import {atom} from "jotai";
import {io} from "socket.io-client";
const {VAR_BACKEND_APP_PORT} = import.meta.env;

const websocketURL = "ws://localhost:" + (VAR_BACKEND_APP_PORT || "5005");
const userInformation = atom(null);
const lastMessage = atom(null);
const onlineUsers = atom([]);
const websocketConnection = io(websocketURL, {
    autoConnect: false,
});

export {websocketConnection, userInformation, onlineUsers, lastMessage};
