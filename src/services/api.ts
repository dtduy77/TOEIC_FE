import axios from 'axios';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithCustomToken, signOut } from 'firebase/auth';
import { getCurrentUserIdToken } from '../firebase';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor to add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      // Get token from localStorage first (faster than requesting a new one)
      const storedToken = localStorage.getItem('access_token');
      
      // If we have a stored token, use it
      if (storedToken) {
        config.headers['Authorization'] = `Bearer ${storedToken}`;
      } else {
        // Otherwise try to get a fresh token
        try {
          const idToken = await getCurrentUserIdToken();
          if (idToken) {
            localStorage.setItem('access_token', idToken);
            config.headers['Authorization'] = `Bearer ${idToken}`;
          }
        } catch (tokenError) {
          console.log('Error getting fresh token:', tokenError);
        }
      }
    } catch (error) {
      console.log('No authenticated user or error getting token');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface Vocabulary {
  id: number;
  word: string;
  meaning: string;
  example?: string;
  user_id: number;
  created_at: string;
  mastery_level?: number;
  notes?: string;
}

export interface VocabIn {
  word: string;
  meaning: string;
  example?: string;
  mastery_level?: number;
  notes?: string;
}

export interface QuizQuestion {
  question: string;
  choices: string[];
  answer: string;
}

export interface UserAuth {
  email: string;
  password: string;
}

export interface UserCreate {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
}

export const api = {
  // Auth endpoints
  logout: async (): Promise<void> => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Call backend to logout
        await axiosInstance.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Sign out from Firebase
      const auth = getAuth();
      await signOut(auth);
      
      // Remove token from localStorage
      localStorage.removeItem('access_token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  register: async (email: string, password: string): Promise<TokenResponse> => {
    try {
      // Call backend to register user
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        username: email, // Using email as username
        full_name: email.split('@')[0] // Default full name from email
      });
      
      // Get custom token from backend
      const customToken = response.data.access_token;
      
      // Sign in with custom token
      const auth = getAuth();
      await signInWithCustomToken(auth, customToken);
      
      // Get ID token
      const idToken = await getCurrentUserIdToken();
      
      // Store ID token
      localStorage.setItem('access_token', idToken);
      
      return { access_token: idToken };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<TokenResponse> => {
    try {
      // First, sign in with Firebase directly
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      
      // Get ID token from Firebase
      const idToken = await getCurrentUserIdToken();
      
      // Store the ID token
      localStorage.setItem('access_token', idToken);
      
      // Verify the token with the backend
      try {
        await axiosInstance.post('/auth/verify-token', {}, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });
      } catch (verifyError) {
        console.warn('Token verification warning:', verifyError);
        // Continue even if verification fails - the deps.py will handle creating the user if needed
      }
      
      return { access_token: idToken };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Vocabulary endpoints
  getVocabulary: async (): Promise<Vocabulary[]> => {
    const response = await axiosInstance.get('/vocabulary/');
    return response.data;
  },

  addVocabulary: async (vocab: VocabIn): Promise<Vocabulary> => {
    const response = await axiosInstance.post('/vocabulary/', vocab);
    return response.data;
  },

  deleteVocabulary: async (vocabId: number): Promise<void> => {
    await axiosInstance.delete(`/vocabulary/${vocabId}`);
  },

  updateVocabulary: async (vocabId: number, data: Partial<VocabIn>): Promise<Vocabulary> => {
    const response = await axiosInstance.put(`/vocabulary/user/update/${vocabId}`, data);
    return response.data;
  },
  
  // User-specific vocabulary endpoints
  getUserVocabulary: async (skip: number = 0, limit: number = 100): Promise<Vocabulary[]> => {
    try {
      // Make sure we have a fresh token
      const auth = getAuth();
      if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken(true);
        localStorage.setItem('access_token', idToken);
      }
      
      const response = await axiosInstance.get('/vocabulary/user', {
        params: { skip, limit },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user vocabulary:', error);
      // Return empty array on error
      return [];
    }
  },

  addVocabularyToUser: async (vocabId: number, masteryLevel: number = 0, notes?: string): Promise<Vocabulary> => {
    const response = await axiosInstance.post(`/vocabulary/user/add/${vocabId}`, {
      mastery_level: masteryLevel,
      notes: notes
    });
    return response.data;
  },

  removeVocabularyFromUser: async (vocabId: number): Promise<void> => {
    await axiosInstance.delete(`/vocabulary/user/remove/${vocabId}`);
  },

  // Quiz endpoints
  generateQuiz: async (quizType?: 'short' | 'long', numQuestions?: number): Promise<QuizQuestion[]> => {
    try {
      // Use the correct endpoint from the backend
      const params: Record<string, any> = {};
      
      // If quiz type is specified, use it
      if (quizType) {
        params.quiz_type = quizType;
      }
      
      // If custom number of questions is specified, use it (overrides quiz_type)
      if (numQuestions) {
        params.num_questions = numQuestions;
      }
      
      const response = await axiosInstance.get('/quiz/generate/', { params });
      console.log('Quiz data fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating quiz:', error);
      // Return empty array if there's an error
      return [];
    }
  },
};