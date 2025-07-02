import React from "react";
import {useState, useEffect} from "react";
import "../styles/Messages.css";
import {useAlert} from "../context/errorMessageContext";
import Groups from "../components/Messages/Groups";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import {getInbox, getLastMessageInGroup, getUserInfo} from "../services/Api";
import {lastMessage, userInformation} from "../lib/GlobalStates";
import {useAtomValue, useSetAtom} from "jotai";
import useWebSocket from "../hooks/useWebSocket";

export default function MessagesPage() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [localLastMessage, setLocalLastMessage] = useState(null);
    const {addMessage} = useAlert();
    const globalLastMessage = useAtomValue(lastMessage);
    const setUser = useSetAtom(userInformation);
    const {joinRoom} = useWebSocket();

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        if (err) {
            console.log('❌ Error fetching user info:', err);
            return;
        }
        setUser(userUseroglu);
    }

    async function getUserInbox() {
        const [groupChatData, error] = await getInbox();
        if (error) return addMessage("hata");

        // Optimized group joining - sadece yeni grupları join et
        groupChatData.forEach(({_id}) => joinRoom(_id));
        
        const lastMessageList = [];
        for (let i = 0; i < groupChatData.length; i++) {
            lastMessageList.push(getLastMessageInGroup(groupChatData[i]._id));
        }
        const lastMessages = await Promise.all(lastMessageList);

        const mergedData = groupChatData.map((chat, id) => {
            const [{sender, message, createdAt}, err] = lastMessages[id];
            if (err) return addMessage("hata");
            return {...chat, lastMessage: {sender, message, createdAt}};
        });
        setGroups(mergedData);
    }

    // Global WebSocket message handler
    useEffect(() => {
        if (globalLastMessage) {
            const matchingIndex = groups.findIndex((item) => item._id === globalLastMessage.groupId);
            const sender = groups[matchingIndex]?.participants.find(({_id: userId}) => userId === globalLastMessage.senderId);
            if (matchingIndex !== -1) {
                const updatedGroups = [...groups];
                updatedGroups[matchingIndex].lastMessage = {
                    sender, 
                    message: globalLastMessage.message,
                    createdAt: globalLastMessage.createdAt
                };
                setGroups(updatedGroups);
                setLocalLastMessage(globalLastMessage.message);
            }
        }
    }, [globalLastMessage, groups]);

    useEffect(() => {
        getUserInformation();
        getUserInbox();
        // eslint-disable-next-line
    }, []);

    function handleSelectGroup(group) {
        setSelectedGroup(group);
    }

    return (
        <div className="container">
            <div className="left-side">
                <Profile></Profile>
                <div className="search">arama kısmı</div>
                <div className="groups">
                    {groups && (
                        <Groups
                            groups={groups}
                            handleSelectGroup={handleSelectGroup}></Groups>
                    )}
                </div>
            </div>
            <div className="right-side">
                {selectedGroup && <MessageSection selectedGroup={selectedGroup}></MessageSection>}
            </div>
        </div>
    );
}
