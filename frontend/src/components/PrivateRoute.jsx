import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { getUserInfo } from "../services/Api";

export default function PrivateRoute({ children }) {
    const { isAuthenticated, setUser } = useAuthContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // If already authenticated in context, no need to check server
            if (isAuthenticated()) {
                setIsChecking(false);
                return;
            }

            try {
                // Check with server if user has valid session
                const [userInfo] = await getUserInfo();
                if (userInfo?.success && userInfo?.data) {
                    setUser(userInfo.data);
                    setIsChecking(false);
                } else {
                    navigate("/auth/login", { 
                        state: { from: location },
                        replace: true 
                    });
                }
            } catch (error) {
                navigate("/auth/login", { 
                    state: { from: location },
                    replace: true 
                });
            }
        };

        checkAuth();
    }, [isAuthenticated, setUser, navigate, location]);

    if (isChecking) {
        return <div className="loading">Yetkilendiriliyor...</div>;
    }

    return isAuthenticated() ? children : null;
}
