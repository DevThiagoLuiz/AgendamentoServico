import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onTodayClick={handleTodayClick}
        />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            backgroundColor: '#f1f5f9',
            p: 3
          }}
        >
          <Outlet context={{ currentDate }} />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
