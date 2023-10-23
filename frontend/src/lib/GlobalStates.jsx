import {atom} from "jotai";
import {io} from "socket.io-client";
// process.env.REACT_APP_WEBSOCKET_URL ||null, (get, set) => set( io(websocketURL)
const websocketURL = "ws://localhost:3005";
const userInformation = atom(null);
const lastMessage = atom(null);
const onlineUsers = atom([]);
const websocketConnection = io(websocketURL, {
    autoConnect: false,
});

export {websocketConnection, userInformation, onlineUsers, lastMessage};
