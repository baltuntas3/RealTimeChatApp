import { createMachine, assign } from 'xstate';
import { logout as logoutApi } from '../services/Api';

export const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',
  context: {
    user: null,
    error: null
  },
  states: {
    idle: {
      on: {
        LOGIN: {
          target: 'authenticating',
          actions: assign({ error: null })
        },
        SET_USER: {
          target: 'authenticated',
          actions: [
            ({ event }) => console.log('🔥 SET_USER action triggered!', event),
            assign(({ event }) => {
              console.log('🎯 Assigning user to context:', event?.user);
              return {
                user: event?.user,
                error: null
              };
            })
          ]
        },
        LOGOUT: 'loggingOut'
      }
    },
    authenticating: {
      on: {
        SUCCESS: {
          target: 'authenticated',
          actions: assign(({ event }) => ({
            user: event?.user,
            error: null
          }))
        },
        FAILURE: {
          target: 'idle',
          actions: assign(({ event }) => ({
            error: event.error || 'Authentication failed'
          }))
        }
      }
    },
    authenticated: {
      on: {
        LOGOUT: 'loggingOut',
        AUTH_ERROR: {
          target: 'idle',
          actions: assign(({ event }) => ({
            user: null,
            error: event.error || 'Authentication failed'
          }))
        },
        REFRESH_TOKEN_FAILED: {
          target: 'idle',
          actions: assign({
            user: null,
            error: 'Session expired. Please login again.'
          })
        }
      }
    },
    loggingOut: {
      invoke: {
        id: 'logoutService',
        src: 'logoutService',
        onDone: {
          target: 'idle',
          actions: assign({ user: null, error: null })
        },
        onError: {
          target: 'idle',
          actions: assign({ user: null, error: null })
        }
      }
    }
  }
}, {
  actors: {
    logoutService: async () => {
      try {
        await logoutApi();
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }
    }
  }
});