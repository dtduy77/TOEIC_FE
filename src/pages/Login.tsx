import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Link,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isAuthenticated, loading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    // Only navigate if we're on the login page and user is authenticated
    if (isAuthenticated && window.location.pathname === '/login') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const success = await loginWithGoogle();
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          sx={{
            p: 4,
            borderRadius: '16px',
            background: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                mb: 2,
              }}
            >
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{
                  color: '#2196F3',
                  textTransform: 'none',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                  },
                }}
              >
                Back to Home
              </Button>
            </Box>
            <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
              Sign In
            </Typography>
            {authError && (
              <Typography
                color="error"
                variant="body2"
                sx={{
                  mb: 2,
                  width: '100%',
                  textAlign: 'center',
                  bgcolor: 'rgba(244, 67, 54, 0.1)',
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                {authError}
              </Typography>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: '12px',
                  height: '50px',
                  textTransform: 'none',
                  fontWeight: 'normal',
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              <Divider sx={{ my: 2 }}>or</Divider>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                disabled={loading}
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  height: '50px',
                  textTransform: 'none',
                  fontWeight: 'normal',
                }}
                onClick={handleGoogleSignIn}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign in with Google'}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: '12px',
                  height: '50px',
                  textTransform: 'none',
                  fontWeight: 'normal',
                }}
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
              <Typography variant="body2" sx={{ color: '#7f8c8d', textAlign: 'center' }}>
                Don't have an account?{' '}
                <Link href="/register" onClick={(e) => {
                  e.preventDefault();
                  navigate('/register');
                }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;