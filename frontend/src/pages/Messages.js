import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/Messages.css";
import { useUser } from "../context/userContext";
import { useMessage } from "../context/messageContext";

import Groups from "../components/Messages/Groups";
import Title from "../components/Messages/Title";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import { getMessagesByGroupId, getInbox, sendMessage } from "../services/api";
import Input from "../components/Input";

export default function MessagesPage() {
    const socket = useRef();
    // const [currentUser, setCurrentUser] = useState(null);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const [conversations, setConversations] = useState(undefined);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(undefined);
    const { user } = useUser();
    const { setSelectedGroup } = useMessage();

    async function getMessages() {
        if (currentChat) {
            const [getMessages, error] = await getMessagesByGroupId(currentChat?._id);
            if (!error) setConversations(getMessages);
        }
    }

    // getUser()
    async function getUserInbox() {
        const [getData, error] = await getInbox();
        if (!error) setMessages(getData);
    }

    async function handleSubmit(e) {
        const messageBuilder = {
            senderId: user.id,
            groupId: currentChat._id,
            message: newMessage.target.value,
        };
        const [send, err] = await sendMessage(messageBuilder);
        if (!err) setConversations([...conversations, send]);
        // const receiverId = currentChat.participants.find((member) => member._id !== user.id);
        socket.current.emit("sendGroupMessage", messageBuilder);
    }

    useEffect(() => {
        getUserInbox();
    }, []);

    useEffect(() => {
        getMessages();
    }, [currentChat]);

    useEffect(() => {
        socket.current = io("ws://localhost:3005");

        socket.current.on("getGroupMessage", (obj) => {
            console.log("*********************", obj);
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
            // you can catch the online users.
            console.log(users, "*0");
        });
    }, [user.id]);

    useEffect(() => {
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
                                    <button
                                        key={id}
                                        onClick={() => {
                                            socket.current.emit("joinGroup", val._id);
                                            setCurrentChat((prev) => {
                                                if (prev) socket.current.emit("leaveGroup", prev._id);
                                            });
                                            setCurrentChat(val);
                                            setSelectedGroup({
                                                groupName: val.groupName,
                                                participants: val.participants,
                                            });
                                        }}
                                    >
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
                    <div className="message-text">
                        <Input className="message-input" onChange={setNewMessage}></Input>
                    </div>
                    <button className="message-send-button" onClick={handleSubmit}>
                        Gönder
                    </button>
                </div>
            </div>
        </div>
    );
}
