import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { logIn } from "../services/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();

    // const [user, setUser] = useState();
    const [user, setUser] = useState(() => {
        let userProfle = localStorage.getItem("userProfile");
        if (userProfle) {
            return jwtDecode(userProfle);
        }
        return null;
    });
    // const [isSocketActive, setIsSocketActive] = useState(false);

    const fetchCurrentUser = async (payload) => {
        const [data, err] = await logIn(payload);
        if (data) {
            localStorage.setItem("userProfile", data.data.accessToken);
            setUser(jwtDecode(data.data.accessToken));
            navigate("/chats");
        } else {
            console.log(err);
        }
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
