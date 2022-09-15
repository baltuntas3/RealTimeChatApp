import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
// import io from 'socket.io-client';
// import jwtDecode from 'jwt-decode';
import Inbox from "./Inbox";

export default function UserInbox() {
    const [messages, setMessages] = useState([]);

    async function getInbox() {
        const getInbox = await axios.get("users/inbox");
        setMessages(getInbox.data);
    }

    useEffect(() => {
        getInbox();
    }, []);

    return (
        <div>
            Inbox Component
            {messages.map((data) => (
                <div key={data._id}>
                    {data._id}
                    {data.participants.map((user) => (
                        <div key={user._id}>{user.userName}</div>
                    ))}
                </div>
            ))}
        </div>
    );
}
