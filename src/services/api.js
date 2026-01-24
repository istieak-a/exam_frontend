// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Base API request handler with error handling
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session-based auth
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data = null;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else if (response.status !== 204) {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle 401 Unauthorized - session might have expired
      if (response.status === 401) {
        // Check if user has data in localStorage
        const savedUser = localStorage.getItem('examhub_user');
        
        if (savedUser) {
          // Don't immediately clear localStorage, let the auth context handle it
          console.log('API call unauthorized, but user data exists in localStorage');
          
          // Dispatch a custom event to notify that session needs refresh
          window.dispatchEvent(new CustomEvent('auth:session-refresh-needed'));
        } else {
          // No saved user data, clear everything
          localStorage.removeItem('examhub_user');
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
        }
      }

      // Create structured error object
      const error = new Error(data?.message || 'An error occurred');
      error.status = response.status;
      error.data = data;
      error.validationErrors = data?.validationErrors || data || null;
      throw error;
    }

    // Unwrap standard ApiResponse envelope if present
    if (data && typeof data === 'object' && 'success' in data) {
      return data.data !== undefined ? data.data : data;
    }

    return data;
  } catch (error) {
    // Re-throw API errors as-is
    if (error.status) {
      throw error;
    }
    // Network or other errors
    const networkError = new Error('Network error. Please check your connection.');
    networkError.status = 0;
    networkError.originalError = error;
    throw networkError;
  }
}

// HTTP method helpers
export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
  
  put: (endpoint, data, options = {}) => 
    apiRequest(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }),
  
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

export default api;
