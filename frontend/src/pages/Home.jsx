import React, {useEffect, useState} from "react";
import {getAllUsers, getUserInfo} from "../services/Api";
import {onlineUsers, userInformation} from "../lib/GlobalStates";
import {useAtomValue, useSetAtom} from "jotai";
import "../styles/home.css";

export default function Home() {
    // Tüm kullanıcıarı listele online olanları online kısmı yap oraya ekle. Tüm kullanıcılarıda filter yap.
    const user = useAtomValue(userInformation);
    const setUser = useSetAtom(userInformation);
    const onlineUserList = useAtomValue(onlineUsers);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        if (err) {
            console.log('❌ Error fetching user info:', err);
            return;
        }
        setUser(userUseroglu);
    }

    async function users() {
        const [data, err] = await getAllUsers();
        if (err) {
            console.log('❌ Error fetching users:', err);
            return;
        }
        console.log('📊 Users API response:', data, 'Type:', typeof data, 'IsArray:', Array.isArray(data));
        setAllUsers(Array.isArray(data) ? data : []);
    }

    useEffect(() => {
        getUserInformation();
        users();
    }, []);
    const updateOnlineUsers = () => {
        if (!Array.isArray(allUsers) || allUsers.length === 0) {
            return;
        }
        
        // Create online users set fresh each time
        const onlineUsersSet = new Set();
        if (Array.isArray(onlineUserList)) {
            onlineUserList.forEach((obj) => onlineUsersSet.add(obj?.userId));
        }
        
        const updatedUsers = allUsers.map((user) => ({
            ...user,
            status: onlineUsersSet.has(user._id) ? "online" : "offline",
        }));
        setFilteredUsers(updatedUsers);
    };

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
