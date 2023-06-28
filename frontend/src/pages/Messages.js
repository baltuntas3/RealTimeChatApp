import React from "react";
import { useState, useEffect } from "react";
import "../styles/Messages.css";
import { useUser } from "../context/userContext";
import { useSocket } from "../context/socketContext";
import { useMessage } from "../context/messageContext";
import { useAlert } from "../context/errorMessageContext";
import Groups from "../components/Messages/Groups";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import { getInbox } from "../services/api";

export default function MessagesPage() {
    const { user } = useUser();
    const { socket } = useSocket();
    const [currentGroupId, setCurrentGroupId] = useState(undefined);
    const [messages, setMessages] = useState([]);
    const { setAlertMessage } = useAlert();

    // const [conversations, setConversations] = useState([]);

    const { setLastMessage, setSelectedGroup } = useMessage();

    // useEffect(() => console.log("ne zaman bura", socket?.current, "----"), [socket]);

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
        if (socket.current) getUserInbox();

        // eslint-disable-next-line
    }, [socket.current]);

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
                {currentGroupId && <MessageSection groupId={currentGroupId}></MessageSection>}
            </div>
        </div>
    );
}
