import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/userContext";
import Input from "../Input";
import { getMessagesByGroupId, getInbox, sendMessage } from "../../services/api";
import Title from "./Title";
import { useMessage } from "../../context/messageContext";

// import Title from "./Title";

export default function MessageSection({ groupId, currentSocket }) {
    async function getMessages() {
        if (groupId) {
            const [getMessages, error] = await getMessagesByGroupId(groupId);
            if (!error) setConversations(getMessages);
        }
    }

    const { user } = useUser();
    const { setLastMessage, setSelectedGroup } = useMessage();

    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(undefined);
    const [conversations, setConversations] = useState([]);
    // const [currentChat, setCurrentChat] = useState(undefined);

    const that = document.getElementById("deneme");
    useEffect(() => {
        that.scrollTo(0, that.scrollHeight);
        console.log(that.scrollHeight, "**");
        getMessages();
    }, [groupId, that.scrollHeight]);

    useEffect(() => {
        currentSocket &&
            currentSocket.on("getGroupMessage", (obj) => {
                // console.log("*********************", obj, " innnner");
                // set current message
                setArrivalMessage({
                    senderId: obj.senderId,
                    message: obj.message,
                });
            });
        // return () => {
        //     // Unmount
        //     socket.current.disconnect();
        // };
    }, [currentSocket]);

    async function handleSubmit(e) {
        const messageBuilder = {
            senderId: user.id,
            groupId: groupId,
            message: newMessage.target.value,
        };
        const [send, err] = await sendMessage(messageBuilder);
        if (!err) setConversations([...conversations, send]);
        // const receiverId = currentChat.participants.find((member) => member._id !== user.id);
        currentSocket.emit("sendGroupMessage", messageBuilder);
        setLastMessage(messageBuilder);
    }

    useEffect(() => {
        arrivalMessage && setConversations((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    function tetik() {
        console.log("tetik");
    }

    return (
        <>
            <Title></Title>
            <div className="message-section" id="deneme">
                {/* iterate this two element  */}
                {conversations.map((val, id) => {
                    const { sender, message } = val;
                    return sender === user.id ? (
                        <div key={id} className="message ">
                            <p className="message-content sender">{message}</p>
                        </div>
                    ) : (
                        <div key={id} className="message ">
                            <p className="message-content receiver">{message}</p>
                        </div>
                    );
                })}
            </div>
            <div className="message-bottom">
                <div className="message-text">
                    <Input className="message-input" onChange={setNewMessage}></Input>
                </div>
                <button className="message-send-button" onClick={handleSubmit}>
                    Gönder
                </button>
            </div>
        </>
    );
}
