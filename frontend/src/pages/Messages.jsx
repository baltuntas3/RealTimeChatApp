import React from "react";
import {useState, useEffect} from "react";
import "../styles/Messages.css";
import {useAlert} from "../context/errorMessageContext";
import Groups from "../components/Messages/Groups";
import MessageSection from "../components/Messages/MessageSection";
import Profile from "../components/Messages/Profile";
import {getInbox, getLastMessageInGroup} from "../services/Api";
import {userInformation, websocketConnection, lastMessage} from "../lib/GlobalStates";
import {useAtomValue, useSetAtom} from "jotai";

export default function MessagesPage() {
    console.log("MESSAGES PAGE RENDERERD");
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [lastMessage, setLastMessage] = useState(null); //trigger re-render
    const {addMessage} = useAlert();

    async function getUserInbox() {
        const [groupChatData, error] = await getInbox();
        if (error) return addMessage("hata");

        groupChatData.map(({_id}) => websocketConnection.emit("joinGroup", _id));
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

    useEffect(() => {
        websocketConnection.on("getGroupMessage", (obj) => {
            const matchingIndex = groups.findIndex((item) => item._id === obj.groupId);
            const sender = groups[matchingIndex]?.participants.find(({_id: userId}) => userId === obj.senderId);
            if (matchingIndex != -1) {
                groups[matchingIndex].lastMessage = {sender, message: obj.message};
                groups[matchingIndex].lastMessage.createdAt = obj.createdAt;
                setLastMessage(obj.message);
            }
        });
    }, [groups]);

    useEffect(() => {
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
