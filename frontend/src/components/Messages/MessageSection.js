import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "../../context/userContext";
import Input from "../Input";
import { getMessagesPagination, sendMessage } from "../../services/api";
import Title from "./Title";
import { useMessage } from "../../context/messageContext";

// import Title from "./Title";

export default function MessageSection({ groupId, currentSocket }) {
    const { user } = useUser();
    const { setLastMessage } = useMessage();

    const messageSection = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(undefined);
    const [scrollable, setScrollable] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);

    async function getMessages() {
        if (groupId) {
            const payload = { groupId: groupId, pageNumber: 1, nPerPage: 30 };
            const [getMessagesData, error] = await getMessagesPagination(payload);
            if (!error) setConversations(getMessagesData.reverse());
        }
    }

    const scrollEvent = useCallback((e) => {
        if (e.target.scrollTop < 100 && e.target.scrollTop && scrollable) {
            setPageNumber((prev) => prev + 1);
        }
        console.log("scrolling");
    }, []);

    useEffect(() => {
        messageSection.current.addEventListener("scroll", scrollEvent);
        if (!scrollable) messageSection.current.removeEventListener("scroll", scrollEvent);
    }, [scrollable]);

    useEffect(() => {
        if (pageNumber > 1) {
            onPageChange();
            console.log(pageNumber);
        }
    }, [pageNumber]);

    useEffect(() => {
        setPageNumber(1);
        getMessages();
        return () => {
            setScrollable(true);
        };
    }, [groupId]);

    useEffect(() => {
        setScrollPos();
    }, [conversations]);

    useEffect(() => {
        currentSocket &&
            currentSocket.on("getGroupMessage", (obj) => {
                setArrivalMessage({
                    senderId: obj.senderId,
                    message: obj.message,
                });
            });
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

    function setScrollPos() {
        const that = messageSection.current;
        that.scrollTo({ top: that.scrollHeight });
    }

    useEffect(() => {
        arrivalMessage && setConversations((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    async function onPageChange() {
        if (groupId && scrollable) {
            const payload = { groupId: groupId, pageNumber: pageNumber, nPerPage: 30 };
            const [getMessagesData, error] = await getMessagesPagination(payload);
            if (!error && getMessagesData.length && pageNumber > 1) {
                setConversations((prev) => [...getMessagesData.reverse(), ...prev]);
                console.log(getMessagesData);
            } else {
                setScrollable(false);
            }
        }
    }

    return (
        <>
            <Title></Title>
            <div className="message-section" ref={messageSection}>
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
                    <Input className="message-input" placeholder="Bir mesaj yazın..." onChange={setNewMessage}></Input>
                </div>
                <button className="message-send-button input-button-style" onClick={handleSubmit}>
                    Gönder
                </button>
            </div>
        </>
    );
}
