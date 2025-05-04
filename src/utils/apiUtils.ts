import { getCurrentUserIdToken } from '../firebase';

/**
 * Utility function to verify a Firebase token with the backend
 * @returns The user data if token is valid
 */
export const verifyToken = async () => {
  try {
    const token = await getCurrentUserIdToken();
    const response = await fetch('http://localhost:8000/auth/verify-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

/**
 * Utility function to handle API errors
 * @param error The error object
 * @returns A formatted error message
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    if (error.response.data && error.response.data.detail) {
      return error.response.data.detail;
    }
    return `Server error: ${error.response.status}`;
  } else if (error.request) {
    // The request was made but no response was received
    return 'No response from server. Please check your connection.';
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || 'An unknown error occurred';
  }
};

/**
 * Utility function to check if the user is authenticated
 * @returns True if the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('access_token') !== null;
};
