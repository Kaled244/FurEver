/**
 * Centralized API Configuration
 * Uses environment variable if available, falls back to localhost for development
 */

const getAPIUrl = () => {
  const env = import.meta.env.VITE_API_BASE_URL;
  // Use the environment variable if set, otherwise use localhost for local development
  return env || 'http://localhost:8080';
};

export const API_BASE_URL = getAPIUrl();

// Common API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
  AUTH_LOGIN: `${API_BASE_URL}/api/auth/login`,
  AUTH_REFRESH: `${API_BASE_URL}/api/auth/refresh`,
  AUTH_LOGOUT: `${API_BASE_URL}/api/auth/logout`,

  // Pets
  PETS_GET_ALL: `${API_BASE_URL}/api/pets`,
  PETS_GET_BY_ID: (id) => `${API_BASE_URL}/api/pets/${id}`,
  PETS_ADD: `${API_BASE_URL}/api/pets/add`,
  PETS_UPDATE: (id) => `${API_BASE_URL}/api/pets/update/${id}`,
  PETS_DELETE: (id) => `${API_BASE_URL}/api/pets/${id}`,
  PETS_MY_PETS: `${API_BASE_URL}/api/pets/my-pets`,
  PETS_IMAGES: (filename) => `${API_BASE_URL}/api/pets/images/${filename}`,

  // Profile
  PROFILE_ME: `${API_BASE_URL}/api/profile/me`,
  PROFILE_UPDATE: `${API_BASE_URL}/api/profile/update`,
  PROFILE_CHANGE_PASSWORD: `${API_BASE_URL}/api/profile/change-password`,

  // Applications
  APPLICATIONS_ALL: `${API_BASE_URL}/api/applications/all`,
  APPLICATIONS_SUBMIT: `${API_BASE_URL}/api/applications/submit`,
  APPLICATIONS_UPDATE_STATUS: (id) => `${API_BASE_URL}/api/applications/${id}/status`,
  APPLICATIONS_MY_SUBMISSIONS: `${API_BASE_URL}/api/applications/my-submissions`,

  // Stats
  STATS_DASHBOARD: `${API_BASE_URL}/api/stats/dashboard`,

  // Uploads
  UPLOADS: (filename) => `${API_BASE_URL}/uploads/${filename}`,
};

// Helper to get API URL for console logs
console.log(`🌐 API Base URL: ${API_BASE_URL}`);
