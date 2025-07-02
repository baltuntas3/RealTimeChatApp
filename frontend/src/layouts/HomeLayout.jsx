import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {logout} from "../services/Api";
import {userInformation} from "../lib/GlobalStates";
import {useSetAtom} from "jotai";

export default function HomeLayout() {
    const navigate = useNavigate();
    const setUser = useSetAtom(userInformation);

    const logoutHandler = () => {
        logout();
        setUser(null);
        navigate("/auth/login");
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
