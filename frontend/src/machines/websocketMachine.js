import { createMachine, assign } from 'xstate';
import { io } from 'socket.io-client';

export const websocketMachine = createMachine({
  id: `websocket-${Date.now()}`, // Force reload with timestamp
  initial: 'disconnected',
  context: {
    connection: null,
    onlineUsers: [],
    lastMessage: null,
    error: null
  },
  states: {
    disconnected: {
      on: {
        CONNECT: 'connecting'
      },
      entry: 'cleanupConnection'
    },
    connecting: {
      invoke: {
        id: 'connectService',
        src: 'connectService',
        onDone: {
          target: 'connected',
          actions: 'setConnection'
        },
        onError: {
          target: 'disconnected',
          actions: 'setError'
        }
      },
      on: {
        DISCONNECT: 'disconnected'
      }
    },
    connected: {
      on: {
        DISCONNECT: 'disconnecting',
        CONNECTION_LOST: 'reconnecting',
        MESSAGE_RECEIVED: {
          actions: 'setLastMessage'
        },
        USERS_UPDATED: {
          actions: 'setOnlineUsers'
        }
      },
      entry: 'setupEventListeners'
    },
    reconnecting: {
      after: {
        1000: 'connecting'
      },
      on: {
        DISCONNECT: 'disconnected'
      }
    },
    disconnecting: {
      invoke: {
        id: 'disconnectService',
        src: 'disconnectService',
        onDone: 'disconnected',
        onError: 'disconnected'
      }
    }
  }
}, {
  actions: {
    setConnection: assign({
      connection: (_, event) => event.data,
      error: null
    }),
    cleanupConnection: assign((context) => {
      if (context.connection) {
        context.connection.disconnect();
        context.connection.removeAllListeners();
      }
      return {
        connection: null,
        onlineUsers: [],
        lastMessage: null,
        error: null
      };
    }),
    setError: assign({
      error: (_, event) => event.data || 'Connection failed'
    }),
    setLastMessage: assign({
      lastMessage: (_, event) => event.message
    }),
    setOnlineUsers: assign({
      onlineUsers: (_, event) => event.users
    }),
    setupEventListeners: (context, _, { send }) => {
      const connection = context.connection;
      if (!connection) return;

      connection.on('getGroupMessage', (message) => {
        send({ type: 'MESSAGE_RECEIVED', message });
      });

      connection.on('getUsers', (users) => {
        send({ type: 'USERS_UPDATED', users });
      });

      connection.on('disconnect', (reason) => {
        console.log('Connection lost:', reason);
        send('CONNECTION_LOST');
      });

      connection.on('connect_error', (error) => {
        console.error('Connection error:', error);
        send({ type: 'CONNECTION_LOST', error });
      });
    }
  },
  services: {
    connectService: async () => {
      const { VAR_BACKEND_APP_PORT } = import.meta.env;
      const websocketURL = `ws://localhost:${VAR_BACKEND_APP_PORT || "5005"}`;
      
      console.log('🔌 Creating WebSocket connection to:', websocketURL);
      
      const connection = io(websocketURL, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
        upgrade: true,
        rememberUpgrade: true,
        timeout: 10000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        maxReconnectionAttempts: 5,
        withCredentials: true, // Send cookies with WebSocket connection
      });

      return new Promise((resolve, reject) => {
        connection.on('connect', () => {
          console.log('✅ WebSocket connected successfully');
          resolve(connection);
        });

        connection.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error);
          reject(error);
        });

        connection.connect();
      });
    },
    disconnectService: async (context) => {
      if (context.connection) {
        console.log('🔒 Disconnecting WebSocket...');
        context.connection.disconnect();
        context.connection.removeAllListeners();
      }
    }
  }
});