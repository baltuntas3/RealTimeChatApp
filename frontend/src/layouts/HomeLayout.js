import { Outlet, Link } from "react-router-dom";
import { useUser } from "../context/userContext";
import { logout } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function HomeLayout() {
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    const logoutHandler = () => {
        logout();
        setUser(false);
        localStorage.setItem("isUserLoggedIn", false);
        navigate("/auth/login");
    };
    return (
        <>
            <nav>
                <Link to="/home" className="link-element">
                    Home
                </Link>
                <Link to="/messages" className="link-element">
                    Messages
                </Link>
                <Link to="/profile" className="link-element">
                    Profile
                </Link>
                <Link to="/auth/login" className="link-element" onClick={logoutHandler}>
                    Logout
                </Link>
            </nav>
            <Outlet />
        </>
    );
}
