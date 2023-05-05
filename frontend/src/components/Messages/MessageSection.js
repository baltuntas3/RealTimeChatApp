import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "../../context/userContext";
import Input from "../Input";
import { getMessagesPagination, sendMessage } from "../../services/api";
import Title from "./Title";
import { useMessage } from "../../context/messageContext";

// import Title from "./Title";

export default function MessageSection({ groupId, currentSocket }) {
    const { user } = useUser();
    const { setLastMessage, selectedGroup } = useMessage();

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
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!scrollable) messageSection.current.removeEventListener("scroll", scrollEvent);
        else messageSection.current.addEventListener("scroll", scrollEvent);
        // eslint-disable-next-line
    }, [scrollable]);

    useEffect(() => {
        if (pageNumber > 1) onPageChange();
    }, [pageNumber]);

    useEffect(() => {
        setPageNumber(1);
        getMessages();
        return () => setScrollable(true);
        // eslint-disable-next-line
    }, [groupId]);

    useEffect(() => {
        setScrollPos();
        // eslint-disable-next-line
    }, [conversations]);

    useEffect(() => {
        currentSocket &&
            currentSocket.on("getGroupMessage", (obj) => {
                setArrivalMessage({
                    senderId: obj.senderId,
                    message: obj.message,
                });
            });
        // eslint-disable-next-line
    }, [currentSocket]);

    async function handleSubmit(e) {
        const messageBuilder = {
            senderId: user.id,
            groupId: groupId,
            message: newMessage.target.value,
            createdAt: new Date().toJSON(),
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
        // eslint-disable-next-line
    }, [arrivalMessage]);

    async function onPageChange() {
        if (groupId && scrollable) {
            const payload = { groupId: groupId, pageNumber: pageNumber, nPerPage: 30 };
            const [getMessagesData, error] = await getMessagesPagination(payload);
            if (!error && getMessagesData.length && pageNumber > 1) {
                setConversations((prev) => [...getMessagesData.reverse(), ...prev]);
            } else {
                setScrollable(false);
            }
        }
    }

    function getUserNameSenderGroupMember(participants = [], participantId) {
        return participants[participants.findIndex(({ _id }) => _id === participantId)].userName;
    }

    return (
        <>
            <Title></Title>
            {/* <div className="message-section-background"></div> */}
            <div className="message-section" ref={messageSection}>
                {/* iterate this two element  */}
                {conversations.map((val, id) => {
                    const { sender, message } = val;
                    return sender === user.id ? (
                        <div key={id} className="message ">
                            {/* TODO: Iki kişiden fazlaysa isimlerini de ekle. Buradan yapılacak. */}

                            <div className="message-content sender">
                                {selectedGroup.participants.length > 2 && (
                                    <p
                                        className="message-sender-name"
                                        style={{ color: `#${sender.substring(sender?.length - 4)}0F` }}
                                    >
                                        {getUserNameSenderGroupMember(selectedGroup?.participants, sender)}
                                    </p>
                                )}
                                {message}
                            </div>
                        </div>
                    ) : (
                        <div key={id} className="message ">
                            <div className="message-content receiver">
                                {selectedGroup.participants.length > 2 && (
                                    <p
                                        className="message-receiver-name"
                                        style={{ color: `#${sender.substring(sender?.length - 4)}FF` }}
                                    >
                                        {getUserNameSenderGroupMember(selectedGroup?.participants, sender)}
                                    </p>
                                )}
                                {message}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="message-bottom">
                <div className="message-text">
                    <Input className="message-input" placeholder="Bir mesaj yazın..." onChange={setNewMessage}></Input>
                </div>
                <button className="message-send-button input-button-style" onClick={handleSubmit}></button>
            </div>
        </>
    );
}
