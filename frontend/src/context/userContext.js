import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { logIn, getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const navigate = useNavigate();

    // const [user, setUser] = useState();
    const [user, setUser] = useState({});

    // const [isSocketActive, setIsSocketActive] = useState(false);

    const fetchCurrentUser = async (payload) => {
        const [data, error] = await logIn(payload);
        if (error) return error;
        setUser(jwtDecode(data.accessToken));
        navigate("/messages");
    };

    // useEffect(() => {
    //     // Write this data into cookie then read it.

    // }, [isSocketActive]);
    async function asink() {
        const [userUseroglu, errr] = await getUserInfo();
        console.log("girdimmmm", user);
        setUser(userUseroglu);
    }

    useEffect(() => {
        asink();
        return () => {
            console.log("unmount event!!");
        };
    }, []);

    useEffect(() => {
        console.log("data");
    }, []);

    return <UserContext.Provider value={{ user, setUser, fetchCurrentUser }}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
export const useUser = () => useContext(UserContext);
