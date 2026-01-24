import api from './api';

/**
 * Chat Service
 * Handles REST API calls for chat messages
 */

const chatService = {
  /**
   * Get global chat messages
   */
  async getGlobalMessages() {
    try {
      const response = await api.get('/api/chat/global');
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch global messages:', error);
      return [];
    }
  },

  /**
   * Post a global message (REST alternative to WebSocket)
   */
  async postGlobalMessage(content) {
    const response = await api.post('/api/chat/global', { content });
    return response.data;
  },

  /**
   * Get private messages between two users
   */
  async getPrivateMessages(otherUserId) {
    const response = await api.get(`/api/chat/private/${otherUserId}`);
    return response.data || [];
  },

  /**
   * Post a private message (REST alternative to WebSocket)
   */
  async postPrivateMessage(recipientId, content) {
    const response = await api.post('/api/chat/private', {
      recipientId,
      content,
    });
    return response.data;
  },

  /**
   * Get list of conversations
   */
  async getConversations() {
    const response = await api.get('/api/chat/conversations');
    return response.data || [];
  },
};

export default chatService;
