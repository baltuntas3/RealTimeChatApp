import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { logIn } from "../services/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();

    // const [user, setUser] = useState();
    const [user, setUser] = useState(() => {
        const [key, value] = document.cookie.split("=");
        let userProfle = value;
        if (userProfle) {
            return jwtDecode(userProfle);
        }
        return null;
    });
    // const [isSocketActive, setIsSocketActive] = useState(false);

    const fetchCurrentUser = async (payload) => {
        const [data, error] = await logIn(payload);
        if (error) return error;
        document.cookie = `accessToken=${data.accessToken}; SameSite=None; Secure;`;
        setUser(jwtDecode(data.accessToken));
        navigate("/chats");
    };

    // useEffect(() => {
    //     // Write this data into cookie then read it.

    // }, [isSocketActive]);
    useEffect(() => {
        return () => {
            localStorage.removeItem("userProfile");
            console.log("unmount event!!");
        };
    }, []);

    useEffect(() => {
        console.log(user, "user useroğlu");
    }, [user]);

    return <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
export const useUser = () => useContext(UserContext);
