import React, {useEffect, useState} from "react";
import {getAllUsers} from "../services/api";
import {onlineUsers, userInformation} from "../lib/GlobalStates";
import {useAtomValue} from "jotai";

export default function Home() {
    // Tüm kullanıcıarı listele online olanları online kısmı yap oraya ekle. Tüm kullanıcılarıda filter yap.
    const user = useAtomValue(userInformation);
    console.log(user, "user useroğlu");
    const onlineUserList = useAtomValue(onlineUsers);
    const [allUsers, setAllUsers] = useState([]);

    async function users() {
        const [data, err] = await getAllUsers();
        // if(err) throw
        setAllUsers(data);
    }

    useEffect(() => {
        users();
    }, []);

    useEffect(() => {
        console.log(onlineUserList, "********************00000***");
    }, [onlineUserList]);

    return (
        <div>
            {allUsers?.map((user) => user.userName)}
            <br />
            <br />
            <br />
            <br />

            {onlineUserList?.map((user) => user.userId)}
        </div>
    );
}
