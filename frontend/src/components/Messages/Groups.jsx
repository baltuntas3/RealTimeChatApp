import {useEffect, useState} from "react";
import {getLastMessageInGroup} from "../../services/api";
import {userInformation, websocketConnection, lastMessage} from "../../lib/GlobalStates";
import {useAtomValue, useAtom} from "jotai";
import {formatDate} from "../../helpers/DateFormatter";

export default function Groups({groups, id}) {
    const [lastGroupMessage, setLastMessage] = useAtom(lastMessage);

    // getLastMessageInGroup
    const {_id, groupName} = groups;
    const user = useAtomValue(userInformation);

    const [getCreatedAt, setCreatedAt] = useState(null);

    async function getLastMessage() {
        const [getMessage, error] = await getLastMessageInGroup(_id);

        if (!error) {
            setLastMessage(getMessage);
            setCreatedAt(getMessage.createdAt);
        }
    }

    useEffect(() => {
        //getGroupMessage
        getLastMessage();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        websocketConnection.on("getGroupMessage", (message) => {
            setLastMessage(message);
            // setLocalLastMessage(message);
            // console.log(message, "---------mesaj mesajoğlu---********/////////////////");
        });
        // eslint-disable-next-line
    }, []);

    function getSenderName() {
        return groups?.participants.filter(({_id: userId}) => user.id !== userId)[0].userName;
    }

    return (
        <div
            className="group-container"
            tabIndex={id}>
            {groups.participants.length > 2 ? (
                <div className="profile-photo profile-photo-group"></div>
            ) : (
                <div className="profile-photo"></div>
            )}

            <div className="group-description">
                <div className="group-title">
                    {groups.participants.length > 2 ? groupName : getSenderName()}

                    <div className="group-last-message group-date">
                        {lastGroupMessage?.groupId === _id
                            ? formatDate(lastGroupMessage.createdAt)
                            : formatDate(getCreatedAt)}
                    </div>
                </div>
                <div className="group-last-message truncate-long-texts">
                    <span className="group-check"></span>
                    {lastGroupMessage?.message}
                </div>
            </div>
        </div>
    );
}
