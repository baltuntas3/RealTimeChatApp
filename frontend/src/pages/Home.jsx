import React, {useEffect, useState} from "react";
import {getAllUsers} from "../services/Api";
import {onlineUsers, userInformation} from "../lib/GlobalStates";
import {useAtomValue} from "jotai";
import "../styles/home.css";

export default function Home() {
    // Tüm kullanıcıarı listele online olanları online kısmı yap oraya ekle. Tüm kullanıcılarıda filter yap.
    // const user = useAtomValue(userInformation);
    const onlineUserList = useAtomValue(onlineUsers);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const onlineUsersSet = new Set();

    async function users() {
        const [data, err] = await getAllUsers();
        // if(err) addMessage
        setAllUsers(data);
    }

    useEffect(() => {
        users();
    }, []);
    function prepareOnlineUserList() {
        onlineUserList.forEach((obj) => onlineUsersSet.add(obj?.userId));
    }

    const updateOnlineUsers = () => {
        prepareOnlineUserList();
        const updatedUsers = allUsers.map((user) => ({
            ...user,
            status: onlineUsersSet.has(user._id) ? "online" : "offline",
        }));
        setFilteredUsers(updatedUsers);
    };

    console.log("RENDEREERERERE");
    useEffect(() => {
        updateOnlineUsers();
    }, [onlineUserList, allUsers]);
    /**
     * TODO: Tüm kullanıcılar içerisinden online olanları eşle ona göre bir simge goy.
     *
     */
    return (
        <div className="container">
            <div className="home-wrapper">
                <div>
                    <button type="button">Grup Oluştur</button>
                    {filteredUsers?.map((user, id) => (
                        <div key={id}>
                            <div className="profile-photo"></div>
                            <div>{user?.userName}</div>
                            <div>{user?.status}</div>
                            <div>
                                <button type="button">Mesaj Gönder</button>
                                <button type="button">Arkadaş Ekle</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="online-users-wrapper">{onlineUserList?.map((user) => user.userId)}</div> */}
            </div>
        </div>
    );
}
