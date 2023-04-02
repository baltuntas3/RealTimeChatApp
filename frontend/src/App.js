import LogIn from "./pages/LogIn";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Messages from "./pages/Messages";
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
                <Link to="/" className="link-element">
                    Register
                </Link>

                {user ? (
                    <>
                        <Link to="/messages" className="link-element">
                            Messages
                        </Link>
                        <Link to="/" className="link-element" onClick={logoutHandler}>
                            Logout
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="link-element">
                        Login
                    </Link>
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
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
