import LogIn from "./pages/LogIn";
import { Route, Routes, Link } from "react-router-dom";
import Messages from "./pages/Messages";
import { useUser } from "./context/userContext";
import { useAlert } from "./context/errorMessageContext";
import { logout } from "./services/api";
import Register from "./pages/Register";
import "./index.css";
import MessageContextProvider from "./context/messageContext";
import ProfilePage from "./pages/Profile";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import Page404 from "./pages/Page404";
import UserContextProvider from "./context/userContext";
import SocketContextProvider from "./context/socketContext";

function App() {
    //user için cookie kontrölü yap

    /**
     * CompoundComponent kullanarak notification ve kullanıcı bilgileriyle ilgili pop component yap.
     * Socket bağlantısı her yerde olsun V
     * Home sayfasında "getUsers" eventinden online kullanıcıları al ve bütün kullanıcıları yazdır.
     * HOme sayfasında kişiler seçilip gonuşma grubu kurulsun mesajlara yönlendir.
     * Error handling yap backend ve frontend için
     * Register düzelt
     * UserAgent bilgisi tutularak aynı kullanıcının farklı tarayıcıdan girişi engellenebilir.
     */

    // const { user, setUser } = useUser();
    const { alertMessage, setAlertMessage } = useAlert();

    return (
        <div className="wrapper">
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <HomeLayout />
                        </PrivateRoute>
                    }
                >
                    <Route
                        index={true}
                        path="home"
                        element={
                            <SocketContextProvider>
                                <Home />
                            </SocketContextProvider>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <SocketContextProvider>
                                <ProfilePage />
                            </SocketContextProvider>
                        }
                    />
                    <Route
                        path="messages"
                        element={
                            <SocketContextProvider>
                                <MessageContextProvider>
                                    <Messages />
                                </MessageContextProvider>
                            </SocketContextProvider>
                        }
                    />
                </Route>
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="register" element={<Register />} />
                    <Route path="login" element={<LogIn />} />
                </Route>
                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}

export default App;
