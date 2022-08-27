import LogIn from "./pages/LogIn";
import jwtDecode from "jwt-decode";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import UserInbox from "./pages/UserInbox";
import Chats from "./pages/Chats";
// import UserInbox from './pages/UserInbox';
import { useUser } from "./context/userContext";
import {useAlert} from "./context/alertContext";
import { logout } from "./api";
import Register from "./pages/Register";
import {useEffect} from "react"

function App() {
    const { user, setUser } = useUser();
    const {alertMessage,setAlertMessage} = useAlert();

    const logoutHandler = () => {
        logout();
        setUser(null);
    };

    useEffect(()=>{
        console.log(alertMessage)
    },[])

    return (
        <div>
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
                <Route path="/messages" element={<Messages />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </div>
    );
}

export default App;
