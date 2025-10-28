import { Box, Typography, Divider, List } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../../features/auth/AuthContext";

// Icons
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

import NavItem from "../common/NavItem";
import logo from "../../assets/favicon.svg";

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = () => {
    logout();
    enqueueSnackbar("Sesión cerrada correctamente 👋", { variant: "info" });
    navigate("/login", { replace: true });
    window.location.reload();
  };

  // 🔹 Ítems principales del panel (visibles para cualquier usuario autenticado)
  const navItems = [
    { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { label: "Blog", icon: <ArticleIcon />, path: "/blog" },
    { label: "Clientes", icon: <PeopleIcon />, path: "/owners" },
    { label: "Pacientes", icon: <PetsIcon />, path: "/pets" },
    { label: "Turnos", icon: <EventIcon />, path: "/appointments" },
    {label: "Historias Clínicas", icon: <FeedIcon />, path: "/clinical-history",},
    // 🔹 Submenú Productos (antes Stock)
    {
      label: "Productos",
      icon: <InventoryIcon />,
      children: [
        { label: "Categorías", path: "/products/categories" },
        { label: "Productos", path: "/products" },
      ],
    },

    // 🔹 Otros módulos
    { label: "Reportes", icon: <BarChartIcon />, path: "/reports" },
    { label: "Seguridad", icon: <SecurityIcon />, path: "/security" },

  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <img src={logo} alt="Logo" width={32} height={32} />
        <Typography variant="h6" fontWeight={700}>
          Clínica Modelo
        </Typography>
      </Box>
      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} onClick={onClose} />
        ))}
      </List>

      <Divider />

      {/* Logout */}
      <NavItem
        label="Cerrar sesión"
        icon={<LogoutIcon />}
        onClick={handleLogout}
        color="error"
      />
    </Box>
  );
};

export default Sidebar;
