import { createContext, useContext, useEffect, useState } from "react";

const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const [alertMessage, setAlertMessage] = useState({ error: "", status: "" });

    useEffect(() => {
        console.log("üçüncü girdim");
    }, []);

    return (
        <AlertContext.Provider value={{ alertMessage, setAlertMessage }} children={children} />
        //     {children}
        // </AlertContext.Provider>
    );
}
export const useAlert = () => useContext(AlertContext);
