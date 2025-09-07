import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const connectionRef = useRef(null);

  const connect = useCallback(() => {
    if (connectionStatus === 'connecting' || connectionStatus === 'connected' || connectionRef.current) {
      console.log('🔄 Connection already exists or in progress, skipping...');
      return;
    }

    console.log('🔌 Starting WebSocket connection...');
    setConnectionStatus('connecting');
    setError(null);

    const { VAR_BACKEND_APP_PORT } = import.meta.env;
    const websocketURL = `ws://localhost:${VAR_BACKEND_APP_PORT || "5005"}`;
    
    console.log('🔌 Creating WebSocket connection to:', websocketURL);
    
    const connection = io(websocketURL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      withCredentials: true,
      timeout: 10000,
      reconnection: true,
      reconnectionDelay: 1000,
      maxReconnectionAttempts: 5,
    });

    connection.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      setConnectionStatus('connected');
      setError(null);
    });

    connection.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setConnectionStatus('disconnected');
      setError('Connection failed');
    });

    connection.on('disconnect', (reason) => {
      console.log('Connection lost:', reason);
      setConnectionStatus('disconnected');
    });

    connection.on('getGroupMessage', (message) => {
      console.log('📨 Received group message:', message);
      setLastMessage(message);
    });

    connection.on('getUsers', (users) => {
      console.log('👥 Users updated:', users);
      setOnlineUsers(users);
    });

    connectionRef.current = connection;
    connection.connect();
  }, [connectionStatus]);

  const disconnect = useCallback(() => {
    if (connectionRef.current) {
      console.log('🔒 Disconnecting WebSocket...');
      connectionRef.current.disconnect();
      connectionRef.current.removeAllListeners();
      connectionRef.current = null;
    }
    setConnectionStatus('disconnected');
    setOnlineUsers([]);
    setLastMessage(null);
    setError(null);
  }, []);

  const send = useCallback((data) => {
    // For compatibility with existing code
    console.log('📤 WebSocket data:', data);
  }, []);

  const value = {
    connectionStatus,
    onlineUsers,
    lastMessage,
    error,
    connection: connectionRef.current,
    isConnected: connectionStatus === 'connected',
    isConnecting: connectionStatus === 'connecting',
    connect,
    disconnect,
    send
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};