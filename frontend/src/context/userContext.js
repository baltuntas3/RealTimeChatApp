import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { logIn, getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAlert } from "./errorMessageContext";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const { alertMessage, setAlertMessage } = useAlert();

    const [user, setUser] = useState({});

    // const [isUserLoggedIn, setIsUserLoggedIn] = useState(() => {
    //     const logIn = localStorage.getItem("isUserLoggedIn");
    //     return logIn === "true" ? true : false;
    // });

    async function fetchCurrentUser(payload) {
        const [data, error] = await logIn(payload);
        if (error) return error;
        setUser(jwtDecode(data.accessToken));
        navigate("/messages");
    }

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        // if (err) throw setAlertMessage(err?.message);
        if (userUseroglu) setUser(userUseroglu);
    }

    useEffect(() => {
        getUserInformation();

        // if (Object.keys(user).length)
        // return () => {
        //     console.log("unmount event!!");
        // };
        // eslint-disable-next-line
    }, []);

    return <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
export const useUser = () => useContext(UserContext);
