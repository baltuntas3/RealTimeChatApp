import LogIn from "./components/LogIn";
import jwtDecode from "jwt-decode";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import UserInbox from "./pages/UserInbox";
import Chats from "./pages/Chats";
// import UserInbox from './pages/UserInbox';
import { useUser } from "./context/userContext";
import { logout } from "./api";

function App() {
    const { user, setUser } = useUser();

    const logoutHandler = () => {
        logout();
        setUser(null);
    };

    return (
        <div>
            <nav>
                <Link to="/">Home</Link>

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
                <Route path="/" element={<Home />}></Route>
                <Route path="/messages" element={<Messages />}></Route>
                <Route path="/login" element={<LogIn />} />
                <Route path="/chats" element={<Chats />}></Route>
            </Routes>
        </div>
    );
}

export default App;
