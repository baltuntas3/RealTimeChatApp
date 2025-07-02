import React, {createContext, useContext, useEffect} from "react";
import {useAtom} from "jotai";
import {userInformation} from "../lib/GlobalStates";
import useAuth from "../hooks/useAuth";

const AuthContext = createContext(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export default AuthContext;
