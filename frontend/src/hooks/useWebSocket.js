import { useEffect, useCallback, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { 
  userInformation, 
  lastMessage, 
  onlineUsers, 
  connectionStatus,
  websocketConnectionAtom
} from '../lib/GlobalStates';

export const useWebSocket = () => {
  const [user] = useAtom(userInformation);
  const [connection, setConnection] = useAtom(websocketConnectionAtom);
  const [status, setStatus] = useAtom(connectionStatus);
  const setOnlineUsers = useSetAtom(onlineUsers);
  const setLastMessage = useSetAtom(lastMessage);
  
  const joinedRooms = useRef(new Set());
  const isInitialized = useRef(false);

  // Event handlers
  const handleConnect = useCallback(() => {
    console.log('✅ WebSocket connected');
    setStatus('connected');
    
    if (user?._id) {
      connection.emit("addUser", user._id);
    }
  }, [connection, user, setStatus]);

  const handleDisconnect = useCallback((reason) => {
    console.log('❌ WebSocket disconnected:', reason);
    setStatus('disconnected');
    setOnlineUsers([]);
    joinedRooms.current.clear();
  }, [setStatus, setOnlineUsers]);

  const handleConnectError = useCallback((error) => {
    console.error('🔥 WebSocket connection error:', error);
    setStatus('error');
  }, [setStatus]);

  const handleGetUsers = useCallback((users) => {
    setOnlineUsers(users);
  }, [setOnlineUsers]);

  const handleGetGroupMessage = useCallback((messageData) => {
    setLastMessage(messageData);
  }, [setLastMessage]);

  // Initialize event listeners (only once)
  useEffect(() => {
    if (!connection || isInitialized.current) return;

    // Remove any existing listeners to prevent duplicates
    connection.off('connect', handleConnect);
    connection.off('disconnect', handleDisconnect);
    connection.off('connect_error', handleConnectError);
    connection.off('getUsers', handleGetUsers);
    connection.off('getGroupMessage', handleGetGroupMessage);

    // Add new listeners
    connection.on('connect', handleConnect);
    connection.on('disconnect', handleDisconnect);
    connection.on('connect_error', handleConnectError);
    connection.on('getUsers', handleGetUsers);
    connection.on('getGroupMessage', handleGetGroupMessage);

    isInitialized.current = true;

    return () => {
      // Cleanup on unmount
      connection.off('connect', handleConnect);
      connection.off('disconnect', handleDisconnect);
      connection.off('connect_error', handleConnectError);
      connection.off('getUsers', handleGetUsers);
      connection.off('getGroupMessage', handleGetGroupMessage);
      isInitialized.current = false;
    };
  }, [connection, handleConnect, handleDisconnect, handleConnectError, handleGetUsers, handleGetGroupMessage]);

  // Connection management based on user state
  useEffect(() => {
    if (user && status === 'disconnected') {
      setConnection({ type: 'CONNECT' });
    } else if (!user && status !== 'disconnected') {
      setConnection({ type: 'DISCONNECT' });
    }
  }, [user, status, setConnection]);

  // API methods
  const connect = useCallback(() => {
    if (status !== 'connected' && status !== 'connecting') {
      setConnection({ type: 'CONNECT' });
    }
  }, [status, setConnection]);

  const disconnect = useCallback(() => {
    if (status !== 'disconnected') {
      setConnection({ type: 'DISCONNECT' });
    }
  }, [status, setConnection]);

  const reset = useCallback(() => {
    setConnection({ type: 'RESET' });
    joinedRooms.current.clear();
  }, [setConnection]);

  const joinRoom = useCallback((roomId) => {
    if (!roomId || joinedRooms.current.has(roomId) || status !== 'connected') {
      return;
    }
    
    connection.emit('joinGroup', roomId);
    joinedRooms.current.add(roomId);
  }, [connection, status]);

  const leaveRoom = useCallback((roomId) => {
    if (joinedRooms.current.has(roomId) && status === 'connected') {
      connection.emit('leaveGroup', roomId);
      joinedRooms.current.delete(roomId);
    }
  }, [connection, status]);

  const sendMessage = useCallback((messageData) => {
    if (status === 'connected') {
      connection.emit('sendGroupMessage', messageData);
    }
  }, [connection, status]);

  return {
    connection,
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    reset,
    joinRoom,
    leaveRoom,
    sendMessage,
    joinedRooms: Array.from(joinedRooms.current)
  };
};

export default useWebSocket;