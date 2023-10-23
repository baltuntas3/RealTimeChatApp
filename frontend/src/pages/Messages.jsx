import React from "react";
import {useState, useEffect} from "react";
import "../styles/Messages.css";
import {useAlert} from "../context/errorMessageContext";
import Groups from "../components/Messages/Groups";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import {getInbox} from "../services/api";
import {userInformation, websocketConnection, lastMessage} from "../lib/GlobalStates";
import {useAtomValue, useSetAtom} from "jotai";

export default function MessagesPage() {
    // TODO BITAIITA
    // const user = useAtomValue(userInformation);
    const lastGroupMessage = useAtomValue(lastMessage);
    console.log("0219921  ", lastGroupMessage);
    const [messages, setMessages] = useState([]);
    const {addMessage} = useAlert();

    const [selectedGroup, setSelectedGroup] = useState(null);

    // useEffect(() => console.log("ne zaman bura", socket?.current, "----"), [socket]);

    // getUser()
    async function getUserInbox() {
        const [groupChatData, error] = await getInbox();
        if (error) return addMessage("hata");

        groupChatData.map(({_id}) => {
            return websocketConnection.emit("joinGroup", _id);
        });

        setMessages(groupChatData);
    }

    useEffect(() => {
        getUserInbox();

        // eslint-disable-next-line
    }, []);

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
                                        console.log(val);
                                        setSelectedGroup(val);
                                    }}>
                                    <Groups
                                        key={id + "key"}
                                        id={val._id}
                                        groups={val}></Groups>
                                </button>
                            );
                        })}
                </div>
            </div>
            <div className="right-side">
                {selectedGroup && <MessageSection selectedGroup={selectedGroup}></MessageSection>}
            </div>
        </div>
    );
}
