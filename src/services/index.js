// Export all services
export { default as api } from './api';
export * from './examService';
export * from './authService';
export { default as chatService } from './chatService';

// Default export with all services
import examService from './examService';
import authService from './authService';
import chatService from './chatService';

export default {
  exam: examService,
  auth: authService,
  chat: chatService,
};
