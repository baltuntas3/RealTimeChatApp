import { useEffect, useState } from "react";
import { getLastMessageInGroup } from "../../services/api";

export default function Groups({ groups }) {
    // getLastMessageInGroup
    const { _id, participants, groupName } = groups;

    const [lastMessage, setLastMessage] = useState([]);

    async function getLastMessage() {
        const [getMessage, error] = await getLastMessageInGroup(_id);
        if (!error) setLastMessage(getMessage[0].message);
    }

    useEffect(() => {
        getLastMessage();
    }, []);
    // Api isteği olup son mesaj alınacak, kişisel
    // mesajsa bireyin adı grup ise grup ismi gelecek başlığa
    return (
        <div className="group-container">
            <div className="profile-photo">asd</div>
            <div className="group-description">
                <div className="group-title">
                    {groupName}
                    <div className="group-date">Dün</div>
                </div>
                <div className="group-last-message">
                    <span className="group-check">Tik</span>
                    {lastMessage.length > 20 ? lastMessage.slice(0, 20) + "..." : lastMessage}
                </div>
            </div>
        </div>
    );
}
