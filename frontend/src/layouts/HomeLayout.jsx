import {Outlet, Link} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {logout, getUserInfo} from "../services/api";
import {userInformation} from "../lib/GlobalStates";
import {useSetAtom} from "jotai";
import {useEffect} from "react";
import {useAlert} from "../context/errorMessageContext";

export default function HomeLayout() {
    const navigate = useNavigate();
    const {addMessage} = useAlert();

    const setUser = useSetAtom(userInformation);

    const logoutHandler = () => {
        logout();
        setUser(null);
        navigate("/auth/login");
    };

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        if (err) throw addMessage(err?.message);
        setUser(userUseroglu);
    }
    useEffect(() => {
        getUserInformation();
    }, []);

    return (
        <>
            <nav>
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
