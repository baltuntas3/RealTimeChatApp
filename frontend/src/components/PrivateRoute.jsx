import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export default function PrivateRoute({children}) {
    const navigate = useNavigate();
    // useEffect(() => {
    //     // console.log(user);
    //     if (!user && !isUserLoggedIn) navigate("/auth/login");
    // }, [user]);

    return children;
}
