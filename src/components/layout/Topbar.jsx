import { AppBar, Box, IconButton, Toolbar, Typography, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/NotificationsNoneRounded';
import { useAuth } from '../../features/auth/AuthContext';

const Topbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={0}
            sx={{
                borderBottom: '1px solid #E0E0E0',
                bgcolor: '#fff',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" fontWeight={700} color="primary.main">
                        Clínica Modelo
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton>
                        <NotificationsIcon />
                    </IconButton>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar
                            alt={user?.username || 'Usuario'}
                            sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}
                        />
                        <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" fontWeight={700}>
                                Dr. {user?.username || 'Usuario'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Veterinario
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
