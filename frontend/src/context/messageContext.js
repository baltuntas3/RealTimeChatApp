import { createContext, useContext, useState } from "react";

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);

    return <MessageContext.Provider value={{ selectedGroup, setSelectedGroup }}>{children}</MessageContext.Provider>;
};

export default MessageContextProvider;
export const useMessage = () => useContext(MessageContext);
