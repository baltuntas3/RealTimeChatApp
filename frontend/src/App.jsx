import LogIn from "./pages/LogIn";
import {Route, Routes, Link} from "react-router-dom";
import Messages from "./pages/Messages";
import Register from "./pages/Register";
import "./index.css";
import ProfilePage from "./pages/Profile";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import Page404 from "./pages/Page404";
import {logout, getUserInfo} from "./services/api";
import {onlineUsers, userInformation, websocketConnection} from "./lib/GlobalStates";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {useEffect, useState} from "react";
import {useAlert} from "./context/errorMessageContext";

function App() {
    const user = useAtomValue(userInformation);
    //user için cookie kontrölü yap
    const {addMessage} = useAlert();
    const setOnlineUsers = useSetAtom(onlineUsers);

    useEffect(() => {
        // websocketConnection.on('getUsers', onGetUsersEvent);

        return () => {
            websocketConnection.disconnect();
        };
    }, []);

    useEffect(() => {
        if (user) {
            websocketConnection.connect();
            console.log(websocketConnection, "socket sokcetoğlu RENDER REDENERNENRENDE");
            websocketConnection.emit("addUser", user?._id);
            websocketConnection.on("getUsers", (users) => {
                setOnlineUsers(users);
                console.log(users, "-------------------********/////////////////");
                // you can catch the online users.
            });
        }
    }, [user]);

    /**
     * CompoundComponent kullanarak notification ve kullanıcı bilgileriyle ilgili pop component yap.
     * Socket bağlantısı her yerde olsun V
     * Home sayfasında "getUsers" eventinden online kullanıcıları al ve bütün kullanıcıları yazdır.
     * HOme sayfasında kişiler seçilip gonuşma grubu kurulsun mesajlara yönlendir.
     * Error handling yap backend ve frontend için
     * Register düzelt
     * UserAgent bilgisi tutularak aynı kullanıcının farklı tarayıcıdan girişi engellenebilir.
     */

    return (
        <div className="wrapper">
            <Routes>
                <Route
                    path="/"
                    element={<HomeLayout />}>
                    <Route
                        index={true}
                        path="home"
                        element={<Home />}
                    />
                    <Route
                        path="profile"
                        element={<ProfilePage />}
                    />
                    <Route
                        path="messages"
                        element={<Messages />}
                    />
                </Route>
                <Route
                    path="/auth"
                    element={<AuthLayout />}>
                    <Route
                        path="register"
                        element={<Register />}
                    />
                    <Route
                        path="login"
                        element={<LogIn />}
                    />
                </Route>
                <Route
                    path="*"
                    element={<Page404 />}
                />
            </Routes>
        </div>
    );
}

export default App;
