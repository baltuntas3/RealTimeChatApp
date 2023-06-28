import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
    const { user, isUserLoggedIn } = useUser();
    const navigate = useNavigate();
    useEffect(() => {
        // console.log(user);
        if (!user && !isUserLoggedIn) navigate("/auth/login");
    }, [user]);

    return children;
}
