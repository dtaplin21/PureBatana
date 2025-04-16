/**
 * Configuration utility for environment-specific settings
 */

// Base URL for API requests
// - Empty string: Same origin (default, works for development and when API is served alongside frontend)
// - Full URL: Use when deploying frontend and backend separately
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? import.meta.env.VITE_API_URL || '' // Use environment variable if set
  : ''; // Default to same-origin in development

// If the URL is empty, API requests will go to the current host
// If it's set, they'll go to the specified URL