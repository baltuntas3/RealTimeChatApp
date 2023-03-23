import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/Messages.css";
import { useUser } from "../context/userContext";
import Groups from "../components/Messages/Groups";
import Title from "../components/Messages/Title";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import { getMessagesByGroupId, getInbox } from "../services/api";

export default function MessagesPage() {
    const socket = useRef();
    // const [currentUser, setCurrentUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState(undefined);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(undefined);
    const { user } = useUser();

    async function getMessages() {
        if (currentChat) {
            const [getMessages, error] = await getMessagesByGroupId(currentChat);
            if (!error) setConversations(getMessages);
        }
    }

    // getUser()
    async function getUserInbox() {
        const [getData, error] = await getInbox();

        if (!error) setMessages(getData);
        // console.log(getData, "-----------------------------------2", error);
    }

    // async function handleSubmit(e) {
    //     const messageBuilder = {
    //         senderId: user.id,
    //         groupId: currentChat._id,
    //         message: newMessage,
    //     };
    //     const send = await axios.post("messages/send", messageBuilder);
    //     setConversations([...conversations, send.data]);

    //     const receiverId = currentChat.participants.find((member) => member._id !== user.id);

    //     socket.current.emit("sendPrivateMessage", {
    //         senderId: user.id,
    //         receiverId: receiverId._id, //user.id,
    //         message: newMessage,
    //     });
    // }

    useEffect(() => {
        getUserInbox();
    }, []);

    useEffect(() => {
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        socket.current = io("ws://localhost:3005");

        socket.current.on("getPrivateMessage", (obj) => {
            console.log(obj, "*********************");
            setArrivalMessage({
                senderId: obj.senderId,
                message: obj.message,
            });
        });

        return () => {
            // Unmount
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", user.id);
        socket.current.on("getUsers", (users) => {
            console.log(users, "*0");
        });
    }, [user.id]);

    useEffect(() => {
        // console.log(arrivalMessage, "------aaa");
        arrivalMessage && setConversations((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    return (
        <div className="container">
            <div className="left-side">
                <Profile></Profile>
                <div className="search">arama kısmı</div>
                <div className="groups">
                    {messages &&
                        messages.map((val, id) => {
                            return (
                                <>
                                    <button key={id} onClick={() => setCurrentChat(val._id)}>
                                        <Groups key={id} groups={val}></Groups>
                                    </button>
                                </>
                            );
                        })}
                </div>
            </div>
            <div className="right-side">
                <Title></Title>
                {conversations && <MessageSection messages={conversations}></MessageSection>}
                <div className="message-bottom">
                    <div className="message-text">mesaj yazılan yer</div>
                    <div className="message-send-button">mesaj gönderme butonu</div>
                </div>
            </div>
        </div>
    );
}
