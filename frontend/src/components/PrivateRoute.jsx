import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
    const { isAuthenticated } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isAuthenticated()) {
            // Save the attempted location for redirecting after login
            navigate("/auth/login", { 
                state: { from: location },
                replace: true 
            });
        }
    }, [isAuthenticated, navigate, location]);

    // Only render children if user is authenticated
    return isAuthenticated() ? children : null;
}
