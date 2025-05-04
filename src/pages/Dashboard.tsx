import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Quiz as QuizIcon,
  FlashOn as FlashIcon,
  Book as BookIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, loading } = useAuth();

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const features = [
    {
      title: 'Vocabulary List',
      description: 'Create and manage your personal vocabulary collection. Add new words, their meanings, and example sentences to build your vocabulary.',
      icon: <BookIcon sx={{ fontSize: 40 }} />,
      path: '/vocabulary',
      buttonText: 'Manage Vocabulary',
    },
    {
      title: 'Flash Cards',
      description: 'Practice your vocabulary with interactive flash cards. Test your memory by flipping cards to reveal meanings.',
      icon: <FlashIcon sx={{ fontSize: 40 }} />,
      path: '/flashcards',
      buttonText: 'Practice with Cards',
    },
    {
      title: 'Quiz Challenge',
      description: 'Test your knowledge with multiple-choice quizzes. Challenge yourself and track your progress.',
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      path: '/quiz',
      buttonText: 'Take a Quiz',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        pb: 4,
      }}
    >
      <AppBar 
        position="static" 
        sx={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6"
              component="div"
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              TOEIC Learning App
            </Typography>
            <Typography 
              variant="subtitle2"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Your Personal Vocabulary Builder
            </Typography>
          </Box>
          <Button 
            color="inherit"
            onClick={() => {
              logout();
            }}
            startIcon={<LogoutIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '8px 20px',
              color: 'white',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 6,
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Welcome back, {user?.email || 'User'}!
          </Typography>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              mb: 1,
              maxWidth: '800px',
            }}
          >
            Ready to enhance your English vocabulary?
          </Typography>
          <Typography 
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'center',
              mb: 4,
              maxWidth: '600px',
            }}
          >
            Choose from our learning tools below to start practicing. Build your vocabulary, test your knowledge, and track your progress.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 4,
          }}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '20px',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                background: 'rgba(255, 255, 255, 0.9)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.47)',
                },
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    mb: 3,
                    color: 'white',
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{
                    color: '#2c3e50',
                    fontWeight: 'bold',
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, minHeight: '60px' }}
                >
                  {feature.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate(feature.path)}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: '25px',
                    padding: '10px 30px',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    },
                  }}
                >
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard; 