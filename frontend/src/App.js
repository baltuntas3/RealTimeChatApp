import LogIn from "./components/LogIn";
import jwtDecode from "jwt-decode";
import { Route, Routes, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Messages from "./pages/Messages";
import UserInbox from "./pages/UserInbox";
import Chats from "./pages/Chats";
import UserContextProvider from "./context/userContext";
// import UserInbox from './pages/UserInbox';

function App() {
    return (
        <UserContextProvider>
            <nav>
                <a href="/">Home </a>
                <a href="/messages">messages </a>
                <a href="/login"> login</a>
            </nav>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/messages" element={<Messages />}></Route>
                <Route path="/login" element={<LogIn />}></Route>
                <Route path="/chats" element={<Chats />}></Route>
            </Routes>
        </UserContextProvider>
    );
}

export default App;
