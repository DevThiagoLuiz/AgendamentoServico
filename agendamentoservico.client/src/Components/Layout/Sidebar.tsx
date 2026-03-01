import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider
} from '@mui/material';

import {
    CalendarToday,
    Build,
    People,
    Timelapse,
    Person,
    Login as LoginIcon,
    Logout as LogoutIcon,
    Dashboard as DashboardIcon
} from '@mui/icons-material';

import { toast } from 'react-toastify';

interface SidebarProps {
    onNavigate?: () => void;
}

const drawerWidth = 260;

const allMenuItems = [
    { text: 'Agenda', icon: <CalendarToday />, path: '/' },

    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', authRequired: true },

    { text: 'Serviços', icon: <Build />, path: '/servicos', authRequired: true },

    { text: 'Funcionários', icon: <People />, path: '/funcionarios', authRequired: true },

    { text: 'Horários', icon: <Timelapse />, path: '/horarios', authRequired: true },

    { text: 'Usuários', icon: <Person />, path: '/usuarios', authRequired: true, adminOnly: true },

    { text: 'Login', icon: <LoginIcon />, path: '/login', guestOnly: true }
];

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');

    const tipo = localStorage
        .getItem('tipo')
        ?.replace(/['"]/g, '')
        .trim();

    const menuItems = allMenuItems.filter(item => {

        if (item.authRequired && !token) return false;

        if (item.adminOnly && tipo !== 'Admin') return false;

        if (item.guestOnly && token) return false;

        return true;
    });

    const handleNavigate = (path: string) => {

        navigate(path);

        if (onNavigate)
            onNavigate();
    };

    const handleLogout = () => {

        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('tipo');

        toast.warning("Deslogado com sucesso!");

        navigate('/login');

        if (onNavigate)
            onNavigate();
    };

    return (

        <Box sx={{ width: drawerWidth, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'background.paper', color: 'text.primary', borderRight: '1px solid rgba(0,0,0,0.06)' }}>

            {/* LOGO */}
            <Box
                sx={{
                    p: 3,
                    borderBottom: '1px solid #1e293b'
                }}
            >

                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5, color: 'primary.main' }}>
                    Agendamento
                </Typography>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Painel administrativo
                </Typography>

            </Box>


            {/* MENU */}
            <Box sx={{ flexGrow: 1, pt: 2 }}>

                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;

                        return (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => handleNavigate(item.path)}
                                    sx={{
                                        mx: 1,
                                        mb: 0.5,
                                        borderRadius: 2,
                                        backgroundColor: isActive ? 'primary.main' : 'transparent',
                                        transition: 'all 0.12s ease',
                                        '&:hover': {
                                            backgroundColor: isActive ? 'primary.dark' : 'action.hover'
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: isActive ? '#fff' : 'text.secondary', minWidth: 40 }}>
                                        {item.icon}
                                    </ListItemIcon>

                                    <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />

                                </ListItemButton>

                            </ListItem>
                        );
                    })}
                </List>

            </Box>


            {/* FOOTER */}
            {token && (
                <Box sx={{ p: 2 }}>

                    <Divider sx={{ mb: 2, borderColor: '#1e293b' }} />

                    <ListItem disablePadding>

                        <ListItemButton

                            onClick={handleLogout}

                            sx={{

                                borderRadius: 2,

                                '&:hover': {

                                    backgroundColor: '#1e293b'
                                }
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    color: '#94a3b8',
                                    minWidth: 40
                                }}
                            >
                                <LogoutIcon />
                            </ListItemIcon>

                            <ListItemText primary="Logout" />

                        </ListItemButton>

                    </ListItem>

                </Box>
            )}

        </Box>

    );
};

export default Sidebar;