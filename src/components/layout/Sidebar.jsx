import { Box, Typography, Divider, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../features/auth/hooks/useAuth";

import DashboardIcon from "@mui/icons-material/GridViewRounded";
import ArticleIcon from "@mui/icons-material/ArticleRounded";
import PeopleIcon from "@mui/icons-material/PeopleAltRounded";
import PetsIcon from "@mui/icons-material/PetsRounded";
import EventIcon from "@mui/icons-material/EventNoteRounded";
import InventoryIcon from "@mui/icons-material/Inventory2Rounded";
import BarChartIcon from "@mui/icons-material/BarChartRounded";
import SecurityIcon from "@mui/icons-material/SecurityRounded";
import LogoutIcon from "@mui/icons-material/LogoutRounded";
import FeedIcon from "@mui/icons-material/FeedRounded";
import VaccinesIcon from "@mui/icons-material/VaccinesRounded";

import NavItem from "../common/NavItem";
import logo from "../../assets/favicon.svg";
import { sidebarStyles } from "./styles/sidebar.styles";

/**
 * Sidebar component that provides navigation links and user actions.
 * @param {function} onClose - Function to be called when the sidebar needs to be closed (for mobile view).
 * @returns {JSX.Element} The Sidebar component.
 */
const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    logout();
    enqueueSnackbar("Sesión cerrada correctamente 👋", { variant: "info" });
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // Main menu
  const navItems = [
    { label: "Inicio", icon: <DashboardIcon />, path: "/" },
    { label: "Blog", icon: <ArticleIcon />, path: "/blog" },
    { label: "Clientes", icon: <PeopleIcon />, path: "/owners" },
    { label: "Pacientes", icon: <PetsIcon />, path: "/pets" },
    { label: "Turnos", icon: <EventIcon />, path: "/appointments" },
    { label: "Historias Clínicas", icon: <FeedIcon />, path: "/clinical-history" },
    { label: "Vacunación", icon: <VaccinesIcon />, path: "/applied-vaccines" },
    {
      label: "Productos",
      icon: <InventoryIcon />,
      children: [
        { label: "Categorías", path: "/products/categories" },
        { label: "Productos", path: "/products" },
      ],
    },
    { label: "Reportes", icon: <BarChartIcon />, path: "/reports" },
  ];

  // Exclusive section for admin users
  if (user?.role === "ADMIN") {
    navItems.push({
      label: "Seguridad",
      icon: <SecurityIcon />,
      path: "/security",
    });
  }

  return (
    <Box sx={sidebarStyles.container}>
      {/* Header */}
      <Box sx={sidebarStyles.header}>
        <Box
          component="img"
          src={logo}
          alt="Logo"
          sx={sidebarStyles.logo}
        />
        <Typography variant="h6" sx={sidebarStyles.headerTitle}>
          Clínica Modelo
        </Typography>
      </Box>

      <Divider sx={sidebarStyles.divider} />

      {/* Navigation */}
      <List sx={sidebarStyles.navList}>
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} onClick={onClose} />
        ))}
      </List>

      <Divider sx={sidebarStyles.divider} />

      {/* Logout */}
      <Box sx={sidebarStyles.logoutSection}>
        <NavItem
          label="Cerrar sesión"
          icon={<LogoutIcon />}
          onClick={handleLogout}
          color="error"
        />
      </Box>
    </Box>
  );
};

export default Sidebar;