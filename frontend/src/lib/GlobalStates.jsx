import React, { createContext, useContext } from 'react';
import { useMachine } from '@xstate/react';
import { websocketMachine } from '../machines/websocketMachine';

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export const WebSocketProvider = ({ children }) => {
  const [state, send] = useMachine(websocketMachine);

  const connect = () => send({ type: 'CONNECT' });
  const disconnect = () => send({ type: 'DISCONNECT' });

  const value = {
    connectionStatus: state.value,
    onlineUsers: state.context.onlineUsers,
    lastMessage: state.context.lastMessage,
    error: state.context.error,
    connection: state.context.connection,
    isConnected: state.matches('connected'),
    isConnecting: state.matches('connecting'),
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

