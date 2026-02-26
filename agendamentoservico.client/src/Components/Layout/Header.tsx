import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Today
} from '@mui/icons-material';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTodayClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onDateChange, onTodayClick }) => {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1e293b',
        color: '#e2e8f0',
        boxShadow: 'none',
        borderBottom: '1px solid #334155'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Today />}
            onClick={onTodayClick}
            sx={{
              borderColor: '#475569',
              color: '#e2e8f0',
              '&:hover': {
                borderColor: '#64748b',
                backgroundColor: '#334155'
              }
            }}
          >
            Hoje
          </Button>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handlePreviousMonth}
              sx={{ color: '#e2e8f0' }}
            >
              <ChevronLeft />
            </IconButton>
            
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
            </Typography>
            
            <IconButton
              onClick={handleNextMonth}
              sx={{ color: '#e2e8f0' }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
