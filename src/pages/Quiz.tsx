import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Paper,
  LinearProgress,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircleOutline as CorrectIcon,
  Cancel as WrongIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api, QuizQuestion } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<Array<{
    word: string;
    correctAnswer: string;
    options: string[];
  }>>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizType, setQuizType] = useState<'short' | 'long' | undefined>(undefined);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  // Function to fetch quiz based on selected type
  const fetchQuiz = async (type?: 'short' | 'long', customQuestions?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const questions = await api.generateQuiz(type, customQuestions);
      
      if (questions.length === 0) {
        setError('Not enough vocabulary words to generate a quiz. Please add more words to your vocabulary.');
        setLoading(false);
        return;
      }
      
      // Transform the backend quiz format to match our component's format
      const formattedQuestions = questions.map(q => ({
        word: q.question.replace("What is the meaning of '", "").replace("'?", ""),
        correctAnswer: q.answer,
        options: q.choices
      }));
      
      setQuizQuestions(formattedQuestions);
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setShowResult(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setError('Failed to load quiz questions. Please make sure you have enough vocabulary words.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to start a quiz with the selected type
  const startQuiz = (type: 'short' | 'long') => {
    setQuizType(type);
    fetchQuiz(type);
  };

  // Function to handle selecting an answer
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === quizQuestions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) setScore(score + 1);

    // Wait a moment to show the result before moving to next question
    setTimeout(() => {
      if (currentQuestionIndex === quizQuestions.length - 1) {
        setShowResult(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }
    }, 1500);
  };

  // Function to restart the quiz with the same questions
  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    fetchQuiz(quizType);
  };
  
  // Function to go back to quiz selection
  const backToQuizSelection = () => {
    setQuizStarted(false);
    setQuizType(undefined);
    setQuizQuestions([]);
    setShowResult(false);
  };

  // Helper function to get appropriate message based on score
  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return "Excellent! You've mastered these words!";
    if (percentage >= 70) return "Great job! You're doing well!";
    if (percentage >= 50) return "Good effort! Keep practicing!";
    return "Keep studying! You'll improve with practice.";
  };

  // Helper function to get color based on score
  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) return '#4CAF50';
    if (percentage >= 70) return '#8BC34A';
    if (percentage >= 50) return '#FFC107';
    return '#F44336';
  };
  
  // Main render function
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* App Bar */}
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
            onClick={() => quizStarted ? backToQuizSelection() : navigate('/dashboard')}
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
            {quizStarted ? 'Vocabulary Quiz' : 'Choose Quiz Type'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="md" 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: 4,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress sx={{ color: 'white' }} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
            <Button 
              onClick={() => navigate('/vocabulary')} 
              sx={{ mt: 2, color: '#f44336', textTransform: 'none' }}
            >
              Go to Vocabulary
            </Button>
          </Alert>
        ) : !quizStarted ? (
          // Quiz selection screen
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <Typography variant="h4" component="div" gutterBottom sx={{ color: 'white', fontWeight: 'bold', mb: 4 }}>
              Choose Your Quiz Challenge
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Paper sx={{ 
                p: 4, 
                borderRadius: '20px',
                width: 280,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Short Quiz
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 3, color: '#7f8c8d' }}>
                  Test your knowledge with 20 questions from your vocabulary list.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => startQuiz('short')}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    borderRadius: '25px',
                    padding: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    },
                  }}
                >
                  Start Short Quiz
                </Button>
              </Paper>
              
              <Paper sx={{ 
                p: 4, 
                borderRadius: '20px',
                width: 280,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Long Quiz
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 3, color: '#7f8c8d' }}>
                  Challenge yourself with 60 questions for a comprehensive review.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => startQuiz('long')}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                    borderRadius: '25px',
                    padding: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #F57C00 30%, #FFB300 90%)',
                    },
                  }}
                >
                  Start Long Quiz
                </Button>
              </Paper>
            </Box>
          </Box>
        ) : !showResult ? (
          // Quiz questions screen
          <>
            <Box sx={{ mb: 4 }}>
              <LinearProgress 
                variant="determinate" 
                value={(currentQuestionIndex / quizQuestions.length) * 100} 
                sx={{ 
                  height: 10, 
                  borderRadius: 5,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 5,
                    backgroundColor: 'white',
                  }
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="body2" component="div" sx={{ color: 'white' }}>
                  Question {currentQuestionIndex + 1} of {quizQuestions.length}
                </Typography>
                <Typography variant="body2" component="div" sx={{ color: 'white' }}>
                  Score: {score}
                </Typography>
              </Box>
            </Box>

            <Card 
              sx={{ 
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  What is the meaning of '{quizQuestions[currentQuestionIndex]?.word}'?
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                  {quizQuestions[currentQuestionIndex]?.options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedAnswer !== null}
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        borderWidth: '2px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        justifyContent: 'flex-start',
                        ...((selectedAnswer === option) && {
                          borderColor: isCorrect ? '#4CAF50' : '#f44336',
                          bgcolor: isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          color: isCorrect ? '#4CAF50' : '#f44336',
                        }),
                        ...(selectedAnswer && option === quizQuestions[currentQuestionIndex].correctAnswer && {
                          borderColor: '#4CAF50',
                          bgcolor: 'rgba(76, 175, 80, 0.1)',
                          color: '#4CAF50',
                        }),
                      }}
                    >
                      {option}
                      {selectedAnswer === option && (
                        <Box sx={{ ml: 'auto' }}>
                          {isCorrect ? (
                            <CorrectIcon sx={{ color: '#4CAF50' }} />
                          ) : (
                            <WrongIcon sx={{ color: '#f44336' }} />
                          )}
                        </Box>
                      )}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </>
        ) : (
          <Dialog
            open={showResult}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
              }
            }}
          >
            <DialogTitle>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <TrophyIcon sx={{ fontSize: 60, color: getScoreColor(), mb: 2 }} />
                <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                  Quiz Complete!
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" component="div" gutterBottom sx={{ color: getScoreColor(), fontWeight: 'bold' }}>
                  Your Score: {score}/{quizQuestions.length}
                </Typography>
                <Typography variant="body1" component="div" sx={{ color: '#7f8c8d' }}>
                  {getScoreMessage()}
                </Typography>
                
                <Typography variant="body2" component="div" sx={{ mt: 2, color: '#7f8c8d' }}>
                  Quiz type: {quizType === 'short' ? 'Short (20 questions)' : 'Long (60 questions)'}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
              <Button
                onClick={backToQuizSelection}
                sx={{
                  color: '#7f8c8d',
                  mr: 1,
                  '&:hover': {
                    background: 'rgba(127, 140, 141, 0.1)',
                  },
                }}
              >
                New Quiz
              </Button>
              <Button
                variant="contained"
                onClick={restartQuiz}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  borderRadius: '25px',
                  padding: '8px 24px',
                  color: 'white',
                  fontWeight: 'bold',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                  },
                }}
              >
                Try Again
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Box>
  );
};

export default Quiz;