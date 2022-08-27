import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const [alertMessage, setAlertMessage] = useState("");

    return (
        <AlertContext.Provider value={{ alertMessage, setAlertMessage }} children={children} />
        //     {children}
        // </AlertContext.Provider>
    );
}
export const useAlert = () => useContext(AlertContext);
