import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    useTheme,
    useMediaQuery,
    Drawer
} from '@mui/material';

import Sidebar from './Sidebar';
import Header from './Header';

const drawerWidth = 260;

const MainLayout: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [mobileOpen, setMobileOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleTodayClick = () => {
        setCurrentDate(new Date());
    };

    const toggleDrawer = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', backgroundColor: 'background.default' }}>

            {/* MOBILE DRAWER */}
            {isMobile && (
                <Drawer
                    open={mobileOpen}
                    onClose={toggleDrawer}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            border: 'none'
                        }
                    }}
                >
                    <Sidebar onNavigate={toggleDrawer} />
                </Drawer>
            )}

            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <Box
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0
                    }}
                >
                    <Sidebar />
                </Box>
            )}

            {/* MAIN AREA */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Header
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    onTodayClick={handleTodayClick}
                    onMenuClick={toggleDrawer}
                    isMobile={isMobile}
                />

                <Box
                    sx={{
                        flexGrow: 1,
                        overflow: 'auto',
                        p: {
                            xs: 2,
                            md: 3
                        }
                    }}
                >
                    <Outlet context={{ currentDate }} />
                </Box>

            </Box>

        </Box>
    );
};

export default MainLayout;