import LogIn from "./pages/LogIn";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Messages from "./pages/Messages";
import Chats from "./pages/Chats";
import { useUser } from "./context/userContext";
import { useAlert } from "./context/errorMessageContext";
import { logout } from "./services/api";
import Register from "./pages/Register";
import "./index.css";
import MessageContextProvider from "./context/messageContext";

function App() {
    //user için cookie kontrölü yap
    const { user, setUser } = useUser();
    const { alertMessage, setAlertMessage } = useAlert();

    const logoutHandler = () => {
        logout();
        setUser(null);
    };

    // useEffect(() => {
    //     console.log("en iç ilk");
    // }, []);

    return (
        <div className="wrapper">
            <nav>
                {/* <Link to="/">Home</Link> */}
                <Link to="/">Register</Link>

                {user ? (
                    <>
                        <Link to="/messages">Messages</Link>
                        <Link to="/" onClick={logoutHandler}>
                            Logout
                        </Link>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </nav>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route
                    path="/messages"
                    element={
                        <MessageContextProvider>
                            <Messages />
                        </MessageContextProvider>
                    }
                />
                <Route path="/login" element={<LogIn />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
