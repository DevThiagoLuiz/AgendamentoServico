import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    Divider
} from '@mui/material';
import {
    CalendarToday,
    Build,
    People,
    Timelapse,
    Login as LoginIcon
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
    { text: 'Agenda', icon: <CalendarToday />, path: '/' },
    { text: 'Serviços', icon: <Build />, path: '/servicos' },
    { text: 'Funcionários', icon: <People />, path: '/funcionarios' },
    { text: 'Horários', icon: <Timelapse />, path: '/horarios' },
    { text: 'Login', icon: <LoginIcon />, path: '/login' }
];

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    borderRight: '1px solid #334155'
                }
            }}
        >
            <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#60a5fa' }}>
                    AgendamentoServiço
                </Typography>
            </Box>
            <Divider sx={{ borderColor: '#334155' }} />
            <List sx={{ pt: 2 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#3b82f6',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#2563eb'
                                    }
                                },
                                '&:hover': {
                                    backgroundColor: '#334155'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;
