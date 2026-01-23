// Export all services
export { default as api } from './api';
export * from './examService';
export * from './authService';

// Default export with all services
import examService from './examService';
import authService from './authService';

export default {
  exam: examService,
  auth: authService,
};
