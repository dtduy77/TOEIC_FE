import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Shuffle as ShuffleIcon,
} from '@mui/icons-material';
import { api, Vocabulary } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const FlashCards: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    loadVocabularies();
  }, [isAuthenticated, navigate]);

  const loadVocabularies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch vocabulary items from the API
      const data = await api.getUserVocabulary();
      console.log('Fetched vocabulary for flashcards:', data);
      setVocabularies(data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error loading vocabulary for flashcards:', error);
      setError('Failed to load vocabulary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    const shuffled = [...vocabularies].sort(() => Math.random() - 0.5);
    setVocabularies(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  if (vocabularies.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          display: 'flex',
          flexDirection: 'column',
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
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Flash Cards
            </Typography>
          </Toolbar>
        </AppBar>

        <Container 
          maxWidth="sm" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 4,
          }}
        >
          <Typography 
            variant="h5" 
            color="white" 
            textAlign="center" 
            gutterBottom
          >
            No vocabulary words found
          </Typography>
          <Typography 
            variant="body1" 
            color="white" 
            textAlign="center" 
            sx={{ mb: 4 }}
          >
            Add some words to your vocabulary list to get started
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/vocabulary')}
            sx={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '10px 30px',
              color: 'white',
              fontWeight: 'bold',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Go to Vocabulary List
          </Button>
        </Container>
      </Box>
    );
  }

  const currentVocabulary = vocabularies[currentIndex];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        display: 'flex',
        flexDirection: 'column',
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
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Flash Cards
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="sm" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2 
        }}>
          <Typography
            variant="body1"
            sx={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Card {currentIndex + 1} of {vocabularies.length}
          </Typography>
          <IconButton
            onClick={handleShuffle}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#2196F3',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.8)',
                transform: 'rotate(180deg)',
              },
              transition: 'all 0.3s ease-in-out',
              width: 40,
              height: 40,
            }}
          >
            <ShuffleIcon />
          </IconButton>
        </Box>

        <Card
          sx={{
            perspective: '1000px',
            backgroundColor: 'transparent',
            borderRadius: '20px',
            height: '300px',
            cursor: 'pointer',
            width: '100%',
            mb: 4,
          }}
          onClick={handleFlip}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateX(180deg)' : 'rotateX(0)',
            }}
          >
            {/* Front */}
            <CardContent
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: '20px',
                p: 4,
              }}
            >
              <Typography variant="h3" component="div" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                {currentVocabulary.word}
              </Typography>
              <Typography variant="body2" component="div" sx={{ color: '#7f8c8d', mt: 2 }}>
                Click to reveal meaning
              </Typography>
            </CardContent>

            {/* Back */}
            <CardContent
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'white',
                borderRadius: '20px',
                transform: 'rotateX(180deg)',
                p: 4,
              }}
            >
              <Typography variant="h4" component="div" sx={{ color: '#2c3e50', fontWeight: 'bold', textAlign: 'center' }}>
                {currentVocabulary.meaning}
              </Typography>
              <Typography variant="body2" component="div" sx={{ color: '#7f8c8d', mt: 2 }}>
                Click to see word
              </Typography>
            </CardContent>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            startIcon={<NavigateBeforeIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#2196F3',
              borderRadius: '12px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            Previous
          </Button>
          <Typography 
            sx={{ 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {currentIndex + 1} / {vocabularies.length}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentIndex === vocabularies.length - 1}
            endIcon={<NavigateNextIcon />}
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              color: '#2196F3',
              borderRadius: '12px',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            Next
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default FlashCards; 