import { createContext, useContext, useEffect, useState, useRef } from "react";

import { useAlert } from "./errorMessageContext";
import { useUser } from "./userContext";
import io from "socket.io-client";

export const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
    const { alertMessage, setAlertMessage } = useAlert();
    const { user } = useUser();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3005";
    const socket = useRef();

    // console.log("socket bura  render renderoğlu");

    useEffect(() => {
        // backend-iweogtomcq-ew.a.run.app
        // const websocketURL = process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:3005";
        if (user) {
            socket.current = io(websocketURL);
        }
        // eslint-disable-next-line
    }, [user]);

    useEffect(() => {
        if (user?.id) {
            socket.current.emit("addUser", user?.id);
            socket.current.on("getUsers", (users) => {
                setOnlineUsers(users);
                console.log(users, "--");
                // you can catch the online users.
            });
        }
        // eslint-disable-next-line
    }, [user?.id]);

    return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

export default SocketContextProvider;
export const useSocket = () => useContext(SocketContext);
