import React from "react";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/Messages.css";
import { useUser } from "../context/userContext";
import { useMessage } from "../context/messageContext";
import { useAlert } from "../context/errorMessageContext";
import Groups from "../components/Messages/Groups";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import { getInbox } from "../services/api";

export default function MessagesPage() {
    const socket = useRef();
    const [currentGroupId, setCurrentGroupId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const { alertMessage, setAlertMessage } = useAlert();
    // const [conversations, setConversations] = useState([]);

    const { user } = useUser();
    const { setLastMessage, setSelectedGroup } = useMessage();

    // getUser()
    async function getUserInbox() {
        const [getData, error] = await getInbox();

        if (error) return setAlertMessage("hata");
        getData.map(({ _id }) => {
            return socket.current.emit("joinGroup", _id);
        });

        setMessages(getData);
    }

    useEffect(() => {
        getUserInbox();
    }, []);

    useEffect(() => {
        // backend-iweogtomcq-ew.a.run.app
        socket.current = io("ws://localhost:3005");

        socket.current.on("getGroupMessage", (obj) => {
            // set last message
            setLastMessage(obj);
        });

        return () => {
            // Unmount
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        socket.current.emit("addUser", user?.id);
        socket.current.on("getUsers", (users) => {
            // you can catch the online users.
        });
    }, [user?.id]);

    return (
        <div className="container">
            <div className="left-side">
                <Profile></Profile>
                <div className="search">arama kısmı</div>
                <div className="groups">
                    {messages &&
                        messages.map((val, id) => {
                            return (
                                <button
                                    key={id}
                                    className="group-btn input-button-style"
                                    onClick={() => {
                                        // setCurrentChat((prev) => {
                                        //     if (prev) socket.current.emit("leaveGroup", prev._id);
                                        // });
                                        setCurrentGroupId(val._id);
                                        setSelectedGroup({
                                            groupName: val.groupName,
                                            participants: val.participants,
                                        });
                                    }}
                                >
                                    <Groups key={id + "key"} id={val._id} groups={val}></Groups>
                                </button>
                            );
                        })}
                </div>
            </div>
            <div className="right-side">
                {currentGroupId && (
                    <MessageSection groupId={currentGroupId} currentSocket={socket.current}></MessageSection>
                )}
            </div>
        </div>
    );
}
