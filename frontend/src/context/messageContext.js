import { createContext, useContext, useState } from "react";

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [lastMessage, setLastMessage] = useState("");

    return (
        <MessageContext.Provider value={{ selectedGroup, setSelectedGroup, lastMessage, setLastMessage }}>
            {children}
        </MessageContext.Provider>
    );
};

export default MessageContextProvider;
export const useMessage = () => useContext(MessageContext);
