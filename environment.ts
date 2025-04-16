/**
 * Environment compatibility layer for both Replit and non-Replit environments
 * 
 * This file provides helper functions to determine the current environment
 * and modify behavior accordingly.
 */

/**
 * Returns true if running in a Replit environment
 */
export const isReplitEnvironment = (): boolean => {
  return typeof process !== 'undefined' && 
         typeof process.env !== 'undefined' && 
         typeof process.env.REPL_ID !== 'undefined';
};

/**
 * Helper for environment-specific behaviors
 */
export const environmentHelper = {
  /**
   * Returns the API base URL depending on environment
   */
  getBaseUrl: (): string => {
    // In both environments, API requests should go to the same origin
    return '';
  },
  
  /**
   * Returns environment-specific configuration for routing
   */
  getRoutingConfig: () => {
    return {
      // Set this to true to enable path-to-regexp strict mode in non-Replit environments
      // This can help catch routing errors early
      strictMode: !isReplitEnvironment(),
      
      // You can add other routing-specific configurations here
    };
  }
};