// This is a compatibility layer for routing in both Replit and non-Replit environments
import React from 'react';
import { Route as WouterRoute, Switch as WouterSwitch, RouteProps } from 'wouter';

/**
 * Enhanced Route component that safely wraps wouter's Route
 * to prevent path-to-regexp errors
 */
export const Route: React.FC<RouteProps> = (props) => {
  // Safety checks to prevent malformed routes
  const path = props.path || '*';
  
  // Ensure the path format is valid to prevent path-to-regexp errors
  // If path contains special characters that aren't valid for path-to-regexp, 
  // they should be properly escaped or handled
  const sanitizedPath = typeof path === 'string' 
    ? path.replace(/https?:\/\/[^/]+/i, '') // Remove domain part
    : path;
    
  return <WouterRoute {...props} path={sanitizedPath} />;
};

/**
 * Enhanced Switch component that safely wraps wouter's Switch
 */
export const Switch: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <WouterSwitch>{children}</WouterSwitch>;
};

// Re-export other wouter components and hooks for consistency
export { Link, useLocation, useRoute } from 'wouter';