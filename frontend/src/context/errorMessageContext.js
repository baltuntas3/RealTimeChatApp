import { createContext, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const addMessage = (message, type = "error") => {
        toast.error(message, { autoClose: 3000, type: type }); // 'info' | 'success' | 'warning' | 'error' | 'default';
    };

    return (
        <AlertContext.Provider value={{ addMessage }}>
            {children}
            <ToastContainer
                position="top-right"
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
