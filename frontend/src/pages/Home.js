import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useSocket } from "../context/socketContext";
import { getAllUsers } from "../services/api";
export default function Home() {
    // Tüm kullanıcıarı listele online olanları online kısmı yap oraya ekle. Tüm kullanıcılarıda filter yap.
    const { user } = useUser();
    const { onlineUsers } = useSocket();
    const [allUsers, setAllUsers] = useState([]);

    async function users() {
        const [data, err] = await getAllUsers();
        // if(err) throw
        setAllUsers(data);
    }

    useEffect(() => {
        users();
    }, []);

    // useEffect(() => {
    //     console.log(allUsers, "---");
    // }, [allUsers]);

    return (
        <div>
            {allUsers.map((user) => user.userName)}
            <br />
            <br />
            <br />
            <br />

            {onlineUsers?.map((user) => user.userId)}
        </div>
    );
}
