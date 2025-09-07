import { useEffect, useCallback, useRef } from 'react';
import { useWebSocket as useWebSocketContext } from '../lib/GlobalStates';
import { useAuthContext } from '../context/AuthContext';

export const useWebSocket = () => {
  const { user } = useAuthContext();
  const webSocket = useWebSocketContext();
  const joinedRooms = useRef(new Set());
  const isInitialized = useRef(false);

  const { connectionStatus, isConnected, connect, disconnect, send } = webSocket;
  const connection = webSocket.connection;

  // Event handlers
  const handleConnect = useCallback(() => {
    console.log('✅ WebSocket connected');
    if (user?._id && connection) {
      console.log('👤 Adding user to WebSocket:', user._id);
      connection.emit("addUser", user._id);
    }
  }, [connection, user]);

  const handleDisconnect = useCallback((reason) => {
    console.log('❌ WebSocket disconnected:', reason);
    joinedRooms.current.clear();
  }, []);

  const handleGetUsers = useCallback((users) => {
    send({ type: 'USERS_UPDATED', users });
  }, [send]);

  const handleGetGroupMessage = useCallback((messageData) => {
    send({ type: 'MESSAGE_RECEIVED', message: messageData });
  }, [send]);

  // Initialize event listeners (only once)
  useEffect(() => {
    if (!connection || isInitialized.current) return;

    connection.on('connect', handleConnect);
    connection.on('disconnect', handleDisconnect);
    connection.on('getUsers', handleGetUsers);
    connection.on('getGroupMessage', handleGetGroupMessage);

    isInitialized.current = true;

    return () => {
      connection.off('connect', handleConnect);
      connection.off('disconnect', handleDisconnect);
      connection.off('getUsers', handleGetUsers);
      connection.off('getGroupMessage', handleGetGroupMessage);
      isInitialized.current = false;
    };
  }, [connection, handleConnect, handleDisconnect, handleGetUsers, handleGetGroupMessage]);

  // Connection management based on user state
  useEffect(() => {
    console.log('🔌 WebSocket user state change:', { 
      user: !!user, 
      userId: user?._id, 
      isConnected, 
      connectionStatus 
    });
    
    if (user && connectionStatus === 'disconnected') {
      console.log('🚀 Attempting WebSocket connection...');
      connect();
    } else if (!user && isConnected) {
      console.log('🔒 Disconnecting WebSocket...');
      disconnect();
    }
  }, [user, connectionStatus, connect, disconnect]);

  const joinRoom = useCallback((roomId) => {
    if (!roomId || joinedRooms.current.has(roomId) || !isConnected) {
      return;
    }
    
    connection?.emit('joinGroup', roomId);
    joinedRooms.current.add(roomId);
  }, [connection, isConnected]);

  const leaveRoom = useCallback((roomId) => {
    if (joinedRooms.current.has(roomId) && isConnected) {
      connection?.emit('leaveGroup', roomId);
      joinedRooms.current.delete(roomId);
    }
  }, [connection, isConnected]);

  const sendMessage = useCallback((messageData) => {
    if (isConnected) {
      connection?.emit('sendGroupMessage', messageData);
    }
  }, [connection, isConnected]);

  return {
    ...webSocket,
    joinRoom,
    leaveRoom,
    sendMessage,
    joinedRooms: Array.from(joinedRooms.current)
  };
};

export default useWebSocket;