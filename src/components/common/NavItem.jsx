import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

const NavItem = ({ label, icon, path, onClick, color }) => {
    const location = useLocation();
    const active = location.pathname === path;

    return (
        <ListItemButton
            component={NavLink}
            to={path}
            onClick={onClick}
            sx={{
                color: active ? 'primary.main' : 'text.primary',
                bgcolor: active ? 'rgba(55,129,227,0.1)' : 'transparent',
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&:hover': { bgcolor: 'rgba(55,129,227,0.08)' },
            }}
        >
            <ListItemIcon sx={{ color: active ? 'primary.main' : 'text.secondary', minWidth: 40 }}>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
};

export default NavItem;
