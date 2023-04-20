import { createContext, useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const [alertMessage, setAlertMessage] = useState(null);
    // { error: err.message, status: err.status }
    useEffect(() => {
        if (alertMessage) toast(alertMessage, { type: toast.TYPE.WARNING });

        // <ToastContainer />;
        console.log(alertMessage);
    }, [alertMessage]);

    return (
        <AlertContext.Provider value={{ alertMessage, setAlertMessage }}>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </AlertContext.Provider>
    );
}
export const useAlert = () => useContext(AlertContext);
