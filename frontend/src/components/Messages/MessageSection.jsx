import {useState, useEffect, useRef, useCallback} from "react";
import {getMessagesPagination, sendMessage} from "../../services/Api";
import Title from "./Title";
import {websocketConnection, userInformation, lastMessage} from "../../lib/GlobalStates";
import {useAtomValue, useSetAtom} from "jotai";

export default function MessageSection({selectedGroup, handleLastMessage}) {
    const {_id: groupId} = selectedGroup;
    const user = useAtomValue(userInformation);
    // const setLastMessage = useSetAtom(lastMessage);
    // const [lastMessage, setLastMessage] = useState(null);
    const messageSection = useRef(null);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(undefined);
    const [scrollable, setScrollable] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);

    async function getMessages() {
        setLoading(true);
        const payload = {groupId: groupId, pageNumber: 1, nPerPage: 30};
        const [getMessagesData, error] = await getMessagesPagination(payload);

        if (!error) setConversations(getMessagesData.reverse());
        setLoading(false);
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
        if (!loading) setScrollPos();
        // eslint-disable-next-line
    }, [loading]);

    useEffect(() => {
        websocketConnection.on("getGroupMessage", (obj) => {
            setArrivalMessage({
                sender: {_id: obj.senderId},
                message: obj.message,
                createdAt: obj.createdAt,
            });
            // setLastMessage(obj.message);
        });
        // eslint-disable-next-line
    }, []);

    async function handleSubmit(e) {
        const messageBuilder = {
            senderId: user._id,
            groupId: groupId,
            message: newMessage,
            createdAt: new Date().toJSON(),
        };
        sendMessage(messageBuilder);
        setNewMessage("");
        websocketConnection.emit("sendGroupMessage", messageBuilder);
    }

    function setScrollPos() {
        const that = messageSection.current;
        that.scrollTo({top: that.scrollHeight});
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleSubmit();
        }
    }

    useEffect(() => {
        arrivalMessage && setConversations((prev) => [...prev, arrivalMessage]);
        // eslint-disable-next-line
    }, [arrivalMessage]);

    async function onPageChange() {
        if (groupId && scrollable) {
            const payload = {groupId: groupId, pageNumber: pageNumber, nPerPage: 30};
            const [getMessagesData, error] = await getMessagesPagination(payload);
            if (!error && getMessagesData.length && pageNumber > 1) {
                setConversations((prev) => [...getMessagesData.reverse(), ...prev]);
            } else {
                setScrollable(false);
            }
        }
    }

    function getUserNameSenderGroupMember(participants = [], participantId) {
        return participants[participants.findIndex(({_id}) => _id === participantId)].userName;
    }

    return (
        <>
            <Title selectedGroup={selectedGroup}></Title>
            <div
                className="message-section"
                ref={messageSection}>
                {conversations.map((val, id) => {
                    const {
                        sender: {_id: senderId, userName: senderUsername},
                        message,
                    } = val;
                    return (
                        <div
                            key={id}
                            className="message ">
                            <div className={`message-content ${senderId === user._id ? "sender" : "receiver"}`}>
                                {selectedGroup.participants.length > 2 && (
                                    <p
                                        className="message-sender-name"
                                        style={{color: `#${senderId.slice(8, 8 + 6)}`}}>
                                        {getUserNameSenderGroupMember(selectedGroup?.participants, senderId)}
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
                    <input
                        className="message-input"
                        value={newMessage}
                        placeholder="Bir mesaj yazın..."
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setNewMessage(e.target.value)}></input>
                </div>
                <div className="message-button-wrapper">
                    <button
                        className="message-send-button input-button-style"
                        onClick={handleSubmit}></button>
                </div>
            </div>
        </>
    );
}
