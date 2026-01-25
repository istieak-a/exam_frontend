import api from './api';

/**
 * Chat Service
 * Handles REST API calls for chat messages
 */

const chatService = {
  /**
   * Get global chat messages
   */
  /**
   * Get global chat messages
   * @param {number} limit - Number of messages to fetch
   * @param {number} before - Timestamp to fetch messages before
   */
  async getGlobalMessages(limit = 50, before) {
    try {
      const params = new URLSearchParams({ limit });
      if (before) {
        params.append('before', before);
      }

      const response = await api.get(`/chat/global?${params.toString()}`);
      return response || [];
    } catch (error) {
      console.error('Failed to fetch global messages:', error);
      return [];
    }
  },

  /**
   * Post a global message (REST alternative to WebSocket)
   */
  async postGlobalMessage(content) {
    const response = await api.post('/chat/global', { content });
    return response.data;
  },

  /**
   * Get private messages between two users
   */
  async getPrivateMessages(otherUserId) {
    const response = await api.get(`/chat/private/${otherUserId}`);
    return response.data || [];
  },

  /**
   * Post a private message (REST alternative to WebSocket)
   */
  async postPrivateMessage(recipientId, content) {
    const response = await api.post('/chat/private', {
      recipientId,
      content,
    });
    return response.data;
  },

  /**
   * Get list of conversations
   */
  async getConversations() {
    const response = await api.get('/chat/conversations');
    return response.data || [];
  },
};

export default chatService;
