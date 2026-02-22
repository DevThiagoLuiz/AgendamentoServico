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
    Person,
    Login as LoginIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 280;

// todos os itens possíveis
const allMenuItems = [
    { text: 'Agenda', icon: <CalendarToday />, path: '/' },
    { text: 'Serviços', icon: <Build />, path: '/servicos', authRequired: true },
    { text: 'Funcionários', icon: <People />, path: '/funcionarios', authRequired: true },
    { text: 'Horários', icon: <Timelapse />, path: '/horarios', authRequired: true },
    { text: 'Usuários', icon: <Person />, path: '/usuarios', authRequired: true, adminOnly: true },
    { text: 'Login', icon: <LoginIcon />, path: '/login', guestOnly: true }
];

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');
    const tipo = localStorage.getItem("tipo")?.replace(/['"]/g, '').trim();

    // filtra itens com base em login/admin
    const menuItems = allMenuItems.filter(item => {
        if (item.authRequired && !token) return false; // se precisa de auth e não está logado, remove
        if (item.adminOnly && tipo !== "Admin") return false; // se precisa de admin e não é admin, remove
        if (item.guestOnly && token) return false; // se é só para convidados e já está logado, remove
        return true;
    });

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('tipo');
        navigate('/login');
    };

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
            <List sx={{ pt: 2, flexGrow: 1 }}>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#3b82f6',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: '#2563eb' }
                                },
                                '&:hover': { backgroundColor: '#334155' }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}

                {/* Botão de Logout */}
                {token && (
                    <>
                        <Divider sx={{ borderColor: '#334155', my: 1 }} />
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={handleLogout}
                                sx={{
                                    '&:hover': { backgroundColor: '#334155' }
                                }}
                            >
                                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" />
                            </ListItemButton>
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;