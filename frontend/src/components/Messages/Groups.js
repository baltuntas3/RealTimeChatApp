import { useEffect, useState } from "react";
import { getLastMessageInGroup } from "../../services/api";
import { useMessage } from "../../context/messageContext";
import { useUser } from "../../context/userContext";
import { formatDate } from "../../helpers/DateFormatter";

export default function Groups({ groups, id }) {
    // getLastMessageInGroup
    const { _id, groupName } = groups;
    const { lastMessage } = useMessage();
    const { user } = useUser();

    const [localLastMessage, setLocalLastMessage] = useState("");
    const [getCreatedAt, setCreatedAt] = useState(null);

    async function getLastMessage() {
        const [[getMessage], error] = await getLastMessageInGroup(_id);
        if (!error) {
            setLocalLastMessage(getMessage);
            setCreatedAt(getMessage.createdAt);
        }
    }

    useEffect(() => {
        if (id === lastMessage.groupId) {
            setLocalLastMessage(lastMessage);
        }
    }, [lastMessage]);

    useEffect(() => {
        getLastMessage();
    }, []);

    function sliceIfTooBig(string) {
        return string?.length > 20 ? string.slice(0, 20) + "..." : string;
    }

    function getSenderName() {
        return groups?.participants.filter(({ _id: userId }) => user.id !== userId)[0].userName;
    }

    return (
        <div className="group-container" tabIndex={id}>
            {groups.participants.length > 2 ? (
                <div className="profile-photo profile-photo-group"></div>
            ) : (
                <div className="profile-photo"></div>
            )}

            <div className="group-description">
                <div className="group-title">
                    {groups.participants.length > 2 ? groupName : getSenderName()}

                    <div className="group-last-message group-date">
                        {lastMessage?.groupId === _id ? formatDate(lastMessage.createdAt) : formatDate(getCreatedAt)}
                    </div>
                </div>
                <div className="group-last-message">
                    <span className="group-check"></span>
                    {lastMessage?.groupId === _id
                        ? sliceIfTooBig(lastMessage.message)
                        : sliceIfTooBig(localLastMessage?.message)}
                </div>
            </div>
        </div>
    );
}
