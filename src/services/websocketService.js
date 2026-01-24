import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WEBSOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = {};
    this.messageCallbacks = {
      global: [],
      private: []
    };
    this.connectionCallbacks = [];
    this.disconnectionCallbacks = [];
  }

  connect(user) {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      // Create STOMP client with SockJS
      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        connectHeaders: {
          userId: user.id,
          username: user.username
        },
        debug: (str) => {
          console.log('[WebSocket Debug]', str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        
        onConnect: () => {
          console.log('✅ WebSocket Connected');
          this.connected = true;
          
          // Subscribe to global messages
          this.subscribeToGlobal(user);
          
          // Subscribe to private messages
          this.subscribeToPrivate(user);
          
          // Notify connection callbacks
          this.connectionCallbacks.forEach(callback => callback());
          
          resolve();
        },
        
        onStompError: (frame) => {
          console.error('❌ STOMP Error:', frame);
          this.connected = false;
          reject(new Error(frame.headers?.message || 'WebSocket connection error'));
        },
        
        onWebSocketClose: () => {
          console.log('🔌 WebSocket Disconnected');
          this.connected = false;
          
          // Notify disconnection callbacks
          this.disconnectionCallbacks.forEach(callback => callback());
        }
      });

      // Activate the client
      this.client.activate();
    });
  }

  disconnect() {
    if (this.client && this.connected) {
      // Unsubscribe from all topics
      Object.values(this.subscriptions).forEach(subscription => {
        subscription.unsubscribe();
      });
      this.subscriptions = {};
      
      // Deactivate the client
      this.client.deactivate();
      this.connected = false;
      console.log('✅ WebSocket Disconnected');
    }
  }

  subscribeToGlobal(user) {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: not connected');
      return;
    }

    const subscription = this.client.subscribe('/topic/global', (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        console.log('📨 Global message received:', chatMessage);
        
        // Notify all global message callbacks
        this.messageCallbacks.global.forEach(callback => {
          callback(chatMessage);
        });
      } catch (error) {
        console.error('Error parsing global message:', error);
      }
    });

    this.subscriptions.global = subscription;
  }

  subscribeToPrivate(user) {
    if (!this.client || !this.connected) {
      console.warn('Cannot subscribe: not connected');
      return;
    }

    const subscription = this.client.subscribe(`/queue/private/${user.id}`, (message) => {
      try {
        const chatMessage = JSON.parse(message.body);
        console.log('📨 Private message received:', chatMessage);
        
        // Notify all private message callbacks
        this.messageCallbacks.private.forEach(callback => {
          callback(chatMessage);
        });
      } catch (error) {
        console.error('Error parsing private message:', error);
      }
    });

    this.subscriptions.private = subscription;
  }

  sendGlobalMessage(message, user) {
    if (!this.client || !this.connected) {
      console.error('Cannot send message: not connected');
      throw new Error('Not connected to chat server');
    }

    const chatMessage = {
      senderId: user.id,
      senderName: user.fullName || user.username,
      senderRole: user.role,
      content: message,
      timestamp: Date.now()
    };

    this.client.publish({
      destination: '/app/chat.global',
      body: JSON.stringify(chatMessage)
    });

    console.log('📤 Sent global message:', chatMessage);
  }

  sendPrivateMessage(message, recipientId, user) {
    if (!this.client || !this.connected) {
      console.error('Cannot send message: not connected');
      throw new Error('Not connected to chat server');
    }

    const chatMessage = {
      senderId: user.id,
      senderName: user.fullName || user.username,
      senderRole: user.role,
      recipientId: recipientId,
      content: message,
      timestamp: Date.now()
    };

    this.client.publish({
      destination: '/app/chat.private',
      body: JSON.stringify(chatMessage)
    });

    console.log('📤 Sent private message:', chatMessage);
  }

  onGlobalMessage(callback) {
    this.messageCallbacks.global.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks.global = this.messageCallbacks.global.filter(cb => cb !== callback);
    };
  }

  onPrivateMessage(callback) {
    this.messageCallbacks.private.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.messageCallbacks.private = this.messageCallbacks.private.filter(cb => cb !== callback);
    };
  }

  onConnect(callback) {
    this.connectionCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(cb => cb !== callback);
    };
  }

  onDisconnect(callback) {
    this.disconnectionCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.disconnectionCallbacks = this.disconnectionCallbacks.filter(cb => cb !== callback);
    };
  }

  isConnected() {
    return this.connected;
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
