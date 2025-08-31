import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {logout} from "../services/Api";
import {useAuthContext} from "../context/AuthContext";

export default function HomeLayout() {
    const navigate = useNavigate();
    const {logout: authLogout} = useAuthContext();

    const logoutHandler = () => {
        logout();
        authLogout();
    };

    return (
        <>
            <nav className="menu-wrapper">
                <Link
                    to="/home"
                    className="link-element">
                    Home
                </Link>
                <Link
                    to="/messages"
                    className="link-element">
                    Messages
                </Link>
                <Link
                    to="/profile"
                    className="link-element">
                    Profile
                </Link>
                <Link
                    to="/auth/login"
                    className="link-element"
                    onClick={logoutHandler}>
                    Logout
                </Link>
            </nav>
            <Outlet />
        </>
    );
}
