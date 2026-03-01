import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ChevronLeft,
    ChevronRight,
    Today,
    CalendarMonth
} from '@mui/icons-material';

interface HeaderProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onTodayClick: () => void;
    onMenuClick?: () => void;
    isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    currentDate,
    onDateChange,
    onTodayClick,
    onMenuClick,
    isMobile: propIsMobile
}) => {

    const theme = useTheme();
    // prefer prop if passed from layout
    const internalIsMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const mobile = typeof propIsMobile !== 'undefined' ? propIsMobile : internalIsMobile;

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
        <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', px: mobile ? 1 : 3, py: 1, flexWrap: 'wrap', gap: mobile ? 1 : 0 }}>

                <Box display="flex" alignItems="center" gap={1}>
                    {mobile && onMenuClick && (
                        <IconButton onClick={onMenuClick} size="small" sx={{ mr: 1 }}>
                            <ChevronLeft sx={{ transform: 'rotate(90deg)' }} />
                        </IconButton>
                    )}

                    <CalendarMonth sx={{ color: theme.palette.primary.main }} />
                    <Typography variant={mobile ? 'body1' : 'h6'} fontWeight="bold" sx={{ color: 'text.primary' }}>
                        Agenda
                    </Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={mobile ? 0.5 : 2} flexWrap="wrap" justifyContent="center">

                    <Button variant="contained" color="primary" startIcon={!mobile && <Today />} onClick={onTodayClick} size={mobile ? 'small' : 'medium'}>
                        {mobile ? 'Hoje' : 'Ir para hoje'}
                    </Button>

                    <Box display="flex" alignItems="center">

                        <IconButton onClick={handlePreviousMonth} size={mobile ? 'small' : 'medium'} sx={{ color: 'text.secondary' }}>
                            <ChevronLeft />
                        </IconButton>

                        <Typography variant={mobile ? 'body1' : 'h6'} sx={{ minWidth: mobile ? 140 : 220, textAlign: 'center', fontWeight: 600, color: 'text.primary' }}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </Typography>

                        <IconButton onClick={handleNextMonth} size={mobile ? 'small' : 'medium'} sx={{ color: 'text.secondary' }}>
                            <ChevronRight />
                        </IconButton>

                    </Box>

                </Box>

            </Toolbar>
        </AppBar>
    );
};

export default Header;