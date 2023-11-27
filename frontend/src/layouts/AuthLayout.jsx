import {Outlet, Link} from "react-router-dom";

export default function AuthLayout() {
    return (
        <>
            <nav className="menu-wrapper">
                <Link
                    to="login"
                    className="link-element">
                    Login
                </Link>
                <Link
                    to="register"
                    className="link-element">
                    Register
                </Link>
            </nav>
            <Outlet />
        </>
    );
}
