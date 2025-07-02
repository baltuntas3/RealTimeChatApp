import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./index.css";
import "./styles/loading.css";
import PrivateRoute from "./components/PrivateRoute";
import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import { AuthProvider } from "./context/AuthContext";
import useWebSocket from "./hooks/useWebSocket";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Messages = lazy(() => import("./pages/Messages"));
const ProfilePage = lazy(() => import("./pages/Profile"));
const LogIn = lazy(() => import("./pages/LogIn"));
const Register = lazy(() => import("./pages/Register"));
const Page404 = lazy(() => import("./pages/Page404"));

function AppContent() {
    // Optimized WebSocket connection management
    useWebSocket();

    return (
        <div className="wrapper">
            <Suspense fallback={<div className="loading">Yükleniyor...</div>}>
                <Routes>
                    {/* Redirect root to home */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={<HomeLayout />}>
                        <Route 
                            path="home" 
                            element={
                                <PrivateRoute>
                                    <Home />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="profile" 
                            element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="messages" 
                            element={
                                <PrivateRoute>
                                    <Messages />
                                </PrivateRoute>
                            } 
                        />
                    </Route>
                    
                    {/* Auth routes */}
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<LogIn />} />
                        <Route path="register" element={<Register />} />
                    </Route>
                    
                    {/* 404 Page */}
                    <Route path="*" element={<Page404 />} />
                </Routes>
            </Suspense>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
