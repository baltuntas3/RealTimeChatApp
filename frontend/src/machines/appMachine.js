import { createMachine, assign } from 'xstate';
import { authMachine } from './authMachine';
import { websocketMachine } from './websocketMachine';

export const appMachine = createMachine({
  id: 'app',
  type: 'parallel',
  context: {
    lastMessage: null
  },
  states: {
    auth: {
      ...authMachine
    },
    websocket: {
      ...websocketMachine
    },
    messaging: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            MESSAGE_RECEIVED: {
              actions: 'setLastMessage'
            }
          }
        }
      }
    }
  }
}, {
  actions: {
    setLastMessage: assign({
      lastMessage: (_, event) => event.message
    })
  }
});