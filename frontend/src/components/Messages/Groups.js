import { useEffect, useState } from "react";
import { getLastMessageInGroup } from "../../services/api";
import { useMessage } from "../../context/messageContext";

export default function Groups({ groups }) {
    // getLastMessageInGroup
    const { _id, groupName } = groups;
    const { lastMessage } = useMessage();

    const [localLastMessage, setLocalLastMessage] = useState("");

    async function getLastMessage() {
        const [getMessage, error] = await getLastMessageInGroup(_id);
        if (!error) setLocalLastMessage(getMessage[0].message);
    }

    useEffect(() => {
        console.log(lastMessage);
    }, [lastMessage]);

    useEffect(() => {
        getLastMessage();
    }, []);

    function sliceIfTooBig(string) {
        return string.length > 20 ? string.slice(0, 20) + "..." : string;
    }

    // Api isteği olup son mesaj alınacak, kişisel V
    // mesajsa bireyin adı grup ise grup ismi gelecek başlığa V
    // Son mesajı ya soketten al ya da veritabanından
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
                    {lastMessage?.groupId === _id
                        ? sliceIfTooBig(lastMessage.message)
                        : sliceIfTooBig(localLastMessage)}
                </div>
            </div>
        </div>
    );
}
