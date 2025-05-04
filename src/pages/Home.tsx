import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  School as SchoolIcon,
  Language as LanguageIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  DevicesOther as DevicesIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      title: 'Personalized Learning',
      description: 'Create your own vocabulary lists and learn at your own pace with customized study materials.',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your learning progress with detailed statistics and performance tracking.',
    },
    {
      icon: <LanguageIcon sx={{ fontSize: 40 }} />,
      title: 'TOEIC Focus',
      description: 'Specially designed for TOEIC test preparation with relevant vocabulary and examples.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Platform',
      description: 'Your data is protected with industry-standard security measures.',
    },
    {
      icon: <DevicesIcon sx={{ fontSize: 40 }} />,
      title: 'Cross-Platform',
      description: 'Access your vocabulary lists and study materials from any device.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
      title: 'Quick Learning',
      description: 'Efficient learning methods including flashcards and interactive quizzes.',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar>
          <Box
            component="img"
            src="/assets/images/logo.jpg"
            alt="TOEIC Learning Logo"
            sx={{
              height: 40,
              width: 'auto',
              marginRight: 2,
              borderRadius: '8px',
            }}
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: '#2c3e50',
              fontWeight: 'bold',
            }}
          >
            TOEIC Learning
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate('/login')}
            sx={{
              color: '#2c3e50',
              mr: 2,
              '&:hover': {
                background: 'rgba(44, 62, 80, 0.1)',
              },
            }}
          >
            Login
          </Button>
          <Button 
            variant="contained"
            onClick={() => navigate('/register')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: '20px',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
            }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          pt: { xs: 8, sm: 12 },
          pb: { xs: 8, sm: 12 },
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: 1, color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <Typography 
                variant={isMobile ? 'h3' : 'h2'} 
                component="h1" 
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Master TOEIC Vocabulary
              </Typography>
              <Typography 
                variant="h5" 
                gutterBottom
                sx={{
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                Boost your English proficiency with our interactive learning platform
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'white',
                  color: '#2196F3',
                  borderRadius: '30px',
                  padding: '12px 40px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.9)',
                  },
                }}
              >
                Get Started Free
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{
            color: '#2c3e50',
            fontWeight: 'bold',
            mb: 6,
          }}
        >
          Why Choose Us?
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 4,
        }}>
          {features.map((feature, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                borderRadius: '20px',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-10px)',
                },
              }}
              elevation={0}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
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
                  sx={{
                    color: '#7f8c8d',
                  }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Box
        sx={{
          bgcolor: '#f8f9fa',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{
              color: '#2c3e50',
              fontWeight: 'bold',
            }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              color: '#7f8c8d',
            }}
          >
            Join thousands of students improving their TOEIC scores with our platform
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: '30px',
              padding: '12px 40px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
            }}
          >
            Create Free Account
          </Button>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'white',
          borderTop: '1px solid #e9ecef',
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="body2" 
            color="text.secondary" 
            align="center"
          >
            © {new Date().getFullYear()} TOEIC Learning. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 