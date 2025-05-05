import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Button 
} from '@mui/material';
import { 
  Warning as WarningIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface NotEnoughVocabAlertProps {
  message: string;
}

const NotEnoughVocabAlert: React.FC<NotEnoughVocabAlertProps> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 3,
        width: '100%',
        maxWidth: 600,
        mx: 'auto',
        borderRadius: '16px',
        border: '1px solid #ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <WarningIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
      
      <Typography variant="h5" component="div" sx={{ 
        fontWeight: 'bold', 
        color: '#e65100',
        mb: 2,
        textAlign: 'center'
      }}>
        Not Enough Vocabulary Words
      </Typography>
      
      <Typography variant="body1" sx={{ 
        mb: 3, 
        textAlign: 'center',
        color: '#424242'
      }}>
        {message}
      </Typography>
      
      <Box sx={{ 
        p: 2, 
        bgcolor: 'rgba(255, 152, 0, 0.05)', 
        borderRadius: '8px',
        mb: 3,
        width: '100%'
      }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#e65100' }}>
          Vocabulary Requirements:
        </Typography>
        <ul style={{ paddingLeft: '20px' }}>
          <li>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              At least <b>4 words</b> for basic quiz functionality
            </Typography>
          </li>
          <li>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <b>20 words</b> for a complete Short Quiz
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <b>60 words</b> for a complete Long Quiz
            </Typography>
          </li>
        </ul>
      </Box>
      
      <Button
        variant="contained"
        color="warning"
        startIcon={<AddIcon />}
        onClick={() => navigate('/vocabulary')}
        sx={{
          borderRadius: '25px',
          px: 3,
          py: 1,
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}
      >
        Add More Vocabulary Words
      </Button>
    </Paper>
  );
};

export default NotEnoughVocabAlert;
