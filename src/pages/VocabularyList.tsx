import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Alert,
  Paper,
  Divider,
  CircularProgress,
  Slider,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Book as BookIcon,
  Edit as EditIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api, Vocabulary, VocabIn } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const VocabularyList: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [vocabularies, setVocabularies] = useState<Vocabulary[]>([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVocabId, setCurrentVocabId] = useState<number | null>(null);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newMasteryLevel, setNewMasteryLevel] = useState<number>(0);
  const [newNotes, setNewNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingWord, setAddingWord] = useState(false);
  const [updatingWord, setUpdatingWord] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      // Use the user-specific endpoint instead of the general one
      const data = await api.getUserVocabulary();
      console.log('Fetched vocabulary data:', data);
      setVocabularies(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      setError('Failed to load vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchVocabulary();
  }, [isAuthenticated, navigate]);

  const handleAddVocabulary = async () => {
    if (!newWord || !newMeaning) {
      setError('Word and meaning are required');
      return;
    }

    setAddingWord(true);
    setError(null);

    try {
      const newVocabData: VocabIn = {
        word: newWord.trim(),
        meaning: newMeaning.trim(),
        mastery_level: newMasteryLevel,
        notes: newNotes.trim() || undefined
      };
      
      if (newExample.trim()) {
        newVocabData.example = newExample.trim();
      }
      
      await api.addVocabulary(newVocabData);
      // Fetch the updated vocabulary list instead of just adding to the state
      await fetchVocabulary();
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      setError('Failed to add new word. Please try again.');
    } finally {
      setAddingWord(false);
    }
  };

  const handleUpdateVocabulary = async () => {
    if (!currentVocabId) return;
    
    if (!newWord || !newMeaning) {
      setError('Word and meaning are required');
      return;
    }

    setUpdatingWord(true);
    setError(null);

    try {
      // For the update endpoint, we only need to send the fields that are changing
      const updateData: Partial<VocabIn> = {
        mastery_level: newMasteryLevel,
        notes: newNotes.trim() || undefined
      };
      
      // Note: According to your backend, the user/update endpoint only updates mastery_level and notes
      // If you want to update word/meaning/example, you'll need to modify the backend or use a different endpoint
      await api.updateVocabulary(currentVocabId, updateData);
      
      // Fetch the updated vocabulary list instead of just updating the state
      await fetchVocabulary();
      
      resetForm();
      setOpen(false);
      setEditMode(false);
      setCurrentVocabId(null);
    } catch (error) {
      console.error('Error updating vocabulary:', error);
      setError('Failed to update word. Please try again.');
    } finally {
      setUpdatingWord(false);
    }
  };
  
  const resetForm = () => {
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setNewMasteryLevel(0);
    setNewNotes('');
    setEditMode(false);
    setCurrentVocabId(null);
  };

  const handleDeleteVocabulary = async (id: number) => {
    if (deletingId) return; // Prevent multiple delete operations
    
    setDeletingId(id);
    try {
      await api.deleteVocabulary(id);
      // Fetch the updated vocabulary list instead of just filtering the state
      await fetchVocabulary();
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      setError('Failed to delete word. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };
  
  const handleEditVocabulary = (vocabulary: Vocabulary) => {
    setEditMode(true);
    setCurrentVocabId(vocabulary.id);
    setNewWord(vocabulary.word);
    setNewMeaning(vocabulary.meaning);
    setNewExample(vocabulary.example || '');
    setNewMasteryLevel(vocabulary.mastery_level || 0);
    setNewNotes(vocabulary.notes || '');
    setOpen(true);
  };
  
  const getMasteryLevelLabel = (level: number) => {
    const labels = ['Beginner', 'Familiar', 'Intermediate', 'Advanced', 'Mastered'];
    return labels[Math.min(level, 4)];
  };

  // Function to handle adding a public vocabulary to user's list
  const handleAddPublicVocabulary = async (vocabId: number) => {
    try {
      const addedVocab = await api.addVocabularyToUser(vocabId, 0);
      setVocabularies(prev => [...prev, addedVocab]);
      setError(null);
    } catch (error) {
      console.error('Error adding public vocabulary:', error);
      setError('Failed to add vocabulary to your list. Please try again.');
    }
  };

  // Function to handle removing a vocabulary from user's list
  const handleRemoveFromUserList = async (vocabId: number) => {
    setDeletingId(vocabId);
    setError(null);
    
    try {
      await api.removeVocabularyFromUser(vocabId);
      setVocabularies(prev => prev.filter(vocab => vocab.id !== vocabId));
    } catch (error) {
      console.error('Error removing vocabulary:', error);
      setError('Failed to remove word from your list. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
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
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              Vocabulary List
            </Typography>
            <Typography 
              variant="subtitle2"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Build and manage your word collection
            </Typography>
          </Box>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
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
            Add New Word
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              borderRadius: '10px',
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              minHeight: '200px',
            }}
          >
            <CircularProgress size={60} sx={{ color: '#2196F3', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#7f8c8d' }}>
              Loading your vocabulary...
            </Typography>
          </Paper>
        ) : vocabularies.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <BookIcon sx={{ fontSize: 60, color: '#bdc3c7', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#7f8c8d', mb: 1 }}>
              Your vocabulary list is empty
            </Typography>
            <Typography variant="body2" sx={{ color: '#95a5a6', textAlign: 'center', mb: 3 }}>
              Start adding words to build your vocabulary collection
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                borderRadius: '25px',
                padding: '10px 24px',
                color: 'white',
                fontWeight: 'bold',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                },
              }}
            >
              Add Your First Word
            </Button>
          </Paper>
        ) : (
          <Paper
            sx={{
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
            }}
          >
            <List sx={{ p: 0 }}>
              {vocabularies.map((vocabulary, index) => (
                <React.Fragment key={vocabulary.id}>
                  <ListItem
                    sx={{
                      p: 3,
                      '&:hover': {
                        background: 'rgba(33, 150, 243, 0.1)',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#2c3e50',
                              fontWeight: 'bold',
                            }}
                          >
                            {vocabulary.word}
                          </Typography>
                          {vocabulary.mastery_level !== undefined && (
                            <Tooltip title={`Mastery Level: ${getMasteryLevelLabel(vocabulary.mastery_level)}`}>
                              <Chip 
                                label={getMasteryLevelLabel(vocabulary.mastery_level)} 
                                size="small" 
                                sx={{ 
                                  backgroundColor: `hsl(${vocabulary.mastery_level * 30}, 70%, 60%)`, 
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  height: '24px'
                                }} 
                              />
                            </Tooltip>
                          )}
                        </Box>
                      }
                      secondary={
                        <Box component="span">
                          <Typography 
                            variant="body1"
                            component="span"
                            sx={{ 
                              color: '#34495e',
                              display: 'block'
                            }}
                          >
                            {vocabulary.meaning}
                          </Typography>
                          {vocabulary.example && (
                            <Typography 
                              variant="body2"
                              component="span" 
                              sx={{ 
                                color: '#7f8c8d',
                                mt: 0.5,
                                fontStyle: 'italic',
                                display: 'block'
                              }}
                            >
                              Example: {vocabulary.example}
                            </Typography>
                          )}
                          {vocabulary.notes && (
                            <Typography 
                              variant="body2"
                              component="span" 
                              sx={{ 
                                color: '#3498db',
                                mt: 0.5,
                                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                p: 1,
                                borderRadius: '4px',
                                display: 'block'
                              }}
                            >
                              Notes: {vocabulary.notes}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => handleEditVocabulary(vocabulary)}
                        sx={{
                          color: '#f39c12',
                          mr: 1,
                          '&:hover': {
                            background: 'rgba(243, 156, 18, 0.1)',
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteVocabulary(vocabulary.id)}
                        disabled={deletingId === vocabulary.id}
                        sx={{
                          color: '#e74c3c',
                          '&:hover': {
                            background: 'rgba(231, 76, 60, 0.1)',
                          },
                        }}
                      >
                        {deletingId === vocabulary.id ? 
                          <CircularProgress size={20} color="inherit" /> : 
                          <DeleteIcon />}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < vocabularies.length - 1 && (
                    <Divider />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Container>

      <Dialog 
        open={open} 
        onClose={() => {
          resetForm();
          setOpen(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            width: '500px',
            maxWidth: '95vw'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
            {editMode ? <EditIcon sx={{ mr: 1 }} /> : <AddIcon sx={{ mr: 1 }} />}
            {editMode ? 'Edit Word' : 'Add New Word'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2 }}>
            {editMode 
              ? 'Update the details of this vocabulary word.'
              : 'Enter the details of the new word you want to add to your vocabulary list.'}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Word"
            fullWidth
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Meaning"
            fullWidth
            value={newMeaning}
            onChange={(e) => setNewMeaning(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Example (Optional)"
            fullWidth
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            variant="outlined"
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
              Mastery Level: <Chip 
                label={getMasteryLevelLabel(newMasteryLevel)} 
                size="small" 
                sx={{ ml: 1, backgroundColor: `hsl(${newMasteryLevel * 30}, 70%, 60%)`, color: 'white' }} 
              />
            </Typography>
            <Slider
              value={newMasteryLevel}
              onChange={(_, value) => setNewMasteryLevel(value as number)}
              step={1}
              marks
              min={0}
              max={4}
              valueLabelDisplay="auto"
              valueLabelFormat={getMasteryLevelLabel}
              sx={{
                color: `hsl(${newMasteryLevel * 30}, 70%, 60%)`,
                '& .MuiSlider-thumb': {
                  height: 24,
                  width: 24,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px hsla(${newMasteryLevel * 30}, 70%, 60%, 0.16)`
                  }
                }
              }}
            />
          </Box>
          
          <TextField
            margin="dense"
            label="Notes (Optional)"
            fullWidth
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            variant="outlined"
            multiline
            rows={2}
            placeholder="Add any personal notes about this word"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => {
              resetForm();
              setOpen(false);
            }}
            sx={{
              color: '#7f8c8d',
              '&:hover': {
                background: 'rgba(127, 140, 141, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={editMode ? handleUpdateVocabulary : handleAddVocabulary}
            variant="contained"
            disabled={editMode ? updatingWord : addingWord}
            sx={{
              background: editMode 
                ? 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)' 
                : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              borderRadius: '25px',
              padding: '8px 24px',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                background: editMode
                  ? 'linear-gradient(45deg, #F57C00 30%, #FFB300 90%)'
                  : 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              },
            }}
          >
            {editMode 
              ? (updatingWord ? <CircularProgress size={24} color="inherit" /> : 'Update Word')
              : (addingWord ? <CircularProgress size={24} color="inherit" /> : 'Add Word')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VocabularyList;