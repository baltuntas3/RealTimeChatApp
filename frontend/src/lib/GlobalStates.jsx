import { atom } from "jotai";
import { io } from "socket.io-client";

const { VAR_BACKEND_APP_PORT } = import.meta.env;

// Basic atoms for state management
export const userInformation = atom(null);
export const lastMessage = atom(null);
export const onlineUsers = atom([]);
export const connectionStatus = atom('disconnected'); // 'connecting', 'connected', 'disconnected', 'error'

// WebSocket connection factory (lazy initialization)
let websocketInstance = null;

export const createWebSocketConnection = () => {
  if (websocketInstance) {
    return websocketInstance;
  }

  const websocketURL = `ws://localhost:${VAR_BACKEND_APP_PORT || "5005"}`;
  
  websocketInstance = io(websocketURL, {
    autoConnect: false,
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true,
    // Connection timeout
    timeout: 10000,
    // Reconnection settings
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    maxReconnectionAttempts: 5,
  });

  return websocketInstance;
};

// Get existing connection or create new one
export const getWebSocketConnection = () => {
  return websocketInstance || createWebSocketConnection();
};

// Reset connection (useful for tests or logout)
export const resetWebSocketConnection = () => {
  if (websocketInstance) {
    websocketInstance.disconnect();
    websocketInstance.removeAllListeners();
    websocketInstance = null;
  }
};

// Derived atom for connection state
export const websocketConnectionAtom = atom(
  () => getWebSocketConnection(),
  (_, set, action) => {
    const connection = getWebSocketConnection();
    
    switch (action.type) {
      case 'CONNECT':
        if (!connection.connected) {
          connection.connect();
          set(connectionStatus, 'connecting');
        }
        break;
        
      case 'DISCONNECT':
        if (connection.connected) {
          connection.disconnect();
          set(connectionStatus, 'disconnected');
        }
        break;
        
      case 'RESET':
        resetWebSocketConnection();
        set(connectionStatus, 'disconnected');
        set(userInformation, null);
        set(onlineUsers, []);
        break;
        
      default:
        console.warn('Unknown WebSocket action:', action);
    }
    
    return connection;
  }
);