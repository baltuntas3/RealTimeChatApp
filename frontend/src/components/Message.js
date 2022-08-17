import axios from "axios";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";

export default function Message(props) {
    const socket = useRef();
    const { groupId } = props;
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    useEffect(() => {
        socket.current = io("ws://localhost:3005");
        console.log("one time");
    }, []);
    useEffect(() => {
        console.log("********************************************");
        const user = getUser();
        socket.current.emit("addUser", user.id);
        socket.current.on("getUsers", (users) => {
            console.log(users);
        });

        socket.current.emit("sendPrivateMessage", {
            senderId: user.id,
            receiverId: "62d1b772d9f0103184f4e8b7", //user.id,
            message: "al bu mesaj",
        });

        socket.current.on("getPrivateMessage", (obj) => {
            getInbox();
            console.log(obj, "-------------------z");
        });
    }, []);

    async function getInbox() {
        const getInbox = await axios.get("messages/" + groupId);
        // socket?.on("GeneralRoom",message=>{
        //   console.log(message,groupId)
        // })
        setMessages(getInbox.data);
        console.log(getInbox.data, "------------------------------><");
    }

    function getUser() {
        const token = localStorage.getItem("token");
        const getUser = jwtDecode(token);
        return getUser;
    }
    // 3005 portu dinle inbox idye göre bağlantı aç bence olur.
    // useEffect(() => {
    //    getInbox()
    // }, []);

    return (
        <div>
            Message --
            {messages.map((message) => (
                <div key={message._id}>{message.message}</div>
            ))}
        </div>
    );
}
