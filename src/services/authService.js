import api from './api';

/**
 * Authentication Service - API functions for user authentication
 */

/**
 * Login user
 * POST /api/auth/login
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data with session cookie
 */
export async function login(email, password) {
  const res = await api.post('/auth/login', { username: email, password });
  return res?.user || res;
}

/**
 * Register new user (signup)
 * POST /api/auth/signup
 * 
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {string} userData.email - Email address
 * @param {string} userData.fullName - Full name
 * @param {string} userData.role - Role (TEACHER or STUDENT)
 * @returns {Promise<Object>} Created user data with session cookie
 */
export async function signup(userData) {
  const res = await api.post('/auth/signup', userData);
  return res?.user || res;
}

/**
 * Register new user (alias for signup)
 * @deprecated Use signup instead
 */
export async function register(userData) {
  return signup(userData);
}

/**
 * Logout user
 * POST /api/auth/logout
 * 
 * @returns {Promise<void>}
 */
export async function logout() {
  return api.post('/auth/logout', {});
}

/**
 * Get current user profile
 * GET /api/auth/me
 * 
 * @returns {Promise<Object>} Current user data
 */
export async function getCurrentUser() {
  const res = await api.get('/auth/me');
  return res?.user || res;
}

/**
 * Update user profile
 * PUT /api/auth/profile
 * 
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Updated user data
 */
export async function updateProfile(profileData) {
  return api.put('/auth/profile', profileData);
}

export default {
  login,
  signup,
  register,
  logout,
  getCurrentUser,
  updateProfile,
};
