import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, createUser, signInWithGoogle, getCurrentUserIdToken } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { api } from '../services/api';

interface User {
  email: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on initial load and listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in
          const idToken = await getCurrentUserIdToken();
          localStorage.setItem('access_token', idToken);
          
          setUser({
            email: firebaseUser.email || '',
            uid: firebaseUser.uid
          });
          setIsAuthenticated(true);
          setError(null);
        } catch (error) {
          console.error('Error getting token:', error);
          setError('Authentication error');
        }
      } else {
        // User is signed out
        localStorage.removeItem('access_token');
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Use the API service to handle login
      await api.login(email, password);
      // Auth state change listener will update the state
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid email or password');
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      await signInWithGoogle();
      // Auth state change listener will update the state
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Use the API service to handle registration
      await api.register(email, password);
      // Auth state change listener will update the state
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      // Auth state change listener will handle the rest
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, isAuthenticated, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};