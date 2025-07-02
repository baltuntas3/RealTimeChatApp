import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userInformation } from '../lib/GlobalStates';
import { useAlert } from '../context/errorMessageContext';
import { logout as logoutApi } from '../services/Api';

export const useAuth = () => {
  const [user, setUser] = useAtom(userInformation);
  const navigate = useNavigate();
  const { addMessage } = useAlert();
  
  // Stabilize refs to prevent re-renders
  const navigateRef = useRef(navigate);
  const addMessageRef = useRef(addMessage);
  
  // Update refs when dependencies change
  useEffect(() => {
    navigateRef.current = navigate;
    addMessageRef.current = addMessage;
  });

  // Debug user state changes
  useEffect(() => {
    console.log('👤 User state changed:', user ? `Logged in as ${user.username || user.userName || 'unknown'}` : 'Logged out');
  }, [user]);

  const logout = useCallback(async () => {
    console.log('🚪 Logout initiated');
    try {
      await logoutApi();
      console.log('✅ Logout API call successful');
    } catch (error) {
      console.warn('⚠️ Logout API call failed:', error);
    } finally {
      // Clear user state regardless of API call result
      console.log('🧹 Clearing user state and redirecting to login');
      setUser(null);
      navigateRef.current('/auth/login', { replace: true });
    }
  }, [setUser]);

  const handleAuthError = useCallback((error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    const url = error.config?.url || '';

    console.log('🔥 Auth error received:', { status, url, message });

    switch (status) {
      case 401:
        // Only logout if this is a refresh token failure
        if (url.includes('refresh-token')) {
          console.log('❌ Refresh token failed, logging out');
          addMessageRef.current('Oturum süreniz doldu. Lütfen tekrar giriş yapın.');
          logout();
        } else {
          // For other 401s, token refresh should have been attempted automatically
          console.warn('⚠️ Unexpected 401 error for non-refresh request:', url);
          addMessageRef.current('Yetkilendirme hatası oluştu.');
        }
        break;
      
      case 403:
        console.log('🚫 403 Forbidden error');
        addMessageRef.current(`Erişim yetkisi yok: ${message}`);
        break;
      
      case 404:
        console.log('🔍 404 Not Found error');
        addMessageRef.current('İstenen kaynak bulunamadı.');
        break;
      
      case 500:
        console.log('💥 500 Server error');
        addMessageRef.current('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
        break;
      
      default:
        console.log('❓ Other error:', status);
        addMessageRef.current(message || 'Bir hata oluştu.');
        break;
    }
  }, [logout]);

  const isAuthenticated = useCallback(() => {
    return !!user;
  }, [user]);

  return {
    user,
    setUser,
    logout,
    handleAuthError,
    isAuthenticated
  };
};

export default useAuth;