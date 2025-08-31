import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAlert } from './errorMessageContext';

const AuthContext = createContext(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { addMessage } = useAlert();
    const [user, setUserState] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize authentication state without server call
    useEffect(() => {
        console.log('🔄 Initializing authentication...');
        setIsLoading(false);
    }, []);

    const login = useCallback((userData) => {
        console.log('🚀 Login called with:', userData);
        setUserState(userData);
        setError(null);
        setIsLoading(false);
        navigate('/', { replace: true });
    }, [navigate]);

    const logout = useCallback(async () => {
        console.log('🔒 Logout called');
        try {
            const { logout: logoutApi } = await import('../services/Api');
            await logoutApi();
        } catch (error) {
            console.error('Logout error:', error);
        }
        setUserState(null);
        setError(null);
        setIsLoading(false);
        navigate('/auth/login', { replace: true });
    }, [navigate]);

    const setUser = useCallback((userData) => {
        console.log('✅ setUser called with:', userData);
        setUserState(userData);
        setError(null);
    }, []);

    const handleAuthError = useCallback((errorObj) => {
        const status = errorObj.response?.status;
        const message = errorObj.response?.data?.message || errorObj.message;
        const url = errorObj.config?.url || '';

        console.log('🔥 Auth error received:', { status, url, message });

        switch (status) {
            case 401:
                if (url.includes('refresh-token')) {
                    console.log('❌ Refresh token failed, logging out');
                    addMessage('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
                    setUserState(null);
                    setError('Session expired');
                    navigate('/auth/login', { replace: true });
                } else if (url.includes('logout')) {
                    // Don't handle logout 401s, they're expected
                    console.log('🔒 Logout 401 ignored');
                } else {
                    console.warn('⚠️ Unexpected 401 error for non-refresh request:', url);
                    addMessage('Yetkilendirme hatası oluştu.');
                    setError(message);
                }
                break;
            
            case 403:
                console.log('🚫 403 Forbidden error');
                addMessage(`Erişim yetkisi yok: ${message}`);
                setError(message);
                break;
            
            case 404:
                console.log('🔍 404 Not Found error');
                addMessage('İstenen kaynak bulunamadı.');
                break;
            
            case 500:
                console.log('💥 500 Server error');
                addMessage('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
                setError('Server error');
                break;
            
            default:
                console.log('❓ Other error:', status);
                addMessage(message || 'Bir hata oluştu.');
                setError(message);
                break;
        }
    }, [navigate, addMessage]);

    const isAuthenticated = useCallback(() => {
        return !!user;
    }, [user]);

    const value = {
        user,
        error,
        isLoading,
        isAuthenticated,
        login,
        logout,
        setUser,
        handleAuthError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
