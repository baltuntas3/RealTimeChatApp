import { createContext, useContext, useEffect, useState, useRef } from "react";
import jwtDecode from "jwt-decode";
import { logIn, getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./errorMessageContext";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const { addMessage } = useAlert();

    const [user, setUser] = useState(false);

    // useEffect(() => console.log("user bura"), []);

    const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
        const logIn = localStorage.getItem("isUserLoggedIn");
        return logIn === "true" ? true : false;
    });

    async function fetchCurrentUser(payload) {
        const [data, error] = await logIn(payload);
        if (error) return addMessage(error.message);
        setUser(jwtDecode(data.accessToken));
        localStorage.setItem("isUserLoggedIn", true);
        setIsUserLoggedIn(true);
        navigate("/messages");
    }

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        if (err) throw addMessage(err?.message);
        if (userUseroglu) setUser(userUseroglu);
    }

    useEffect(() => {
        if (isUserLoggedIn) getUserInformation();
        // eslint-disable-next-line
    }, [isUserLoggedIn]);

    return (
        <UserContext.Provider value={{ user, setUser, fetchCurrentUser, isUserLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
export const useUser = () => useContext(UserContext);
