import React from 'react';
import { Box, Typography, Divider, List } from '@mui/material';
import { NavLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/GridViewRounded';
import PeopleIcon from '@mui/icons-material/PeopleAltRounded';
import PetsIcon from '@mui/icons-material/PetsRounded';
import EventIcon from '@mui/icons-material/EventNoteRounded';
import InventoryIcon from '@mui/icons-material/Inventory2Rounded';
import BarChartIcon from '@mui/icons-material/BarChartRounded';
import SecurityIcon from '@mui/icons-material/SecurityRounded';
import LogoutIcon from '@mui/icons-material/LogoutRounded';
import NavItem from '../common/NavItem';
import logo from '../../assets/favicon.svg'; // luego agregamos tu logo

const Sidebar = ({ onClose }) => {
  const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { label: 'Clientes', icon: <PeopleIcon />, path: '/owners' },
    { label: 'Pacientes', icon: <PetsIcon />, path: '/pets' },
    { label: 'Turnos', icon: <EventIcon />, path: '/appointments' },
    { label: 'Stock', icon: <InventoryIcon />, path: '/stock' },
    { label: 'Reportes', icon: <BarChartIcon />, path: '/reports' },
    { label: 'Seguridad', icon: <SecurityIcon />, path: '/security' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Encabezado */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <img src={logo} alt="Logo" width={32} height={32} />
        <Typography variant="h6" fontWeight={700}>
          Clínica Modelo
        </Typography>
      </Box>
      <Divider />

      {/* Navegación */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} onClick={onClose} />
        ))}
      </List>

      <Divider />
      <NavItem label="Cerrar sesión" icon={<LogoutIcon />} path="/login" color="error" />
    </Box>
  );
};

export default Sidebar;
