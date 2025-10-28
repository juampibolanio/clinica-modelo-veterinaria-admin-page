import { AppBar, Box, IconButton, Toolbar, Typography, Avatar, Tooltip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneRounded";
import { useAuth } from "../../features/auth/AuthContext";

const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  console.log(user)

  // 🧩 Derivar nombre visible del usuario
  const displayName = user
    ? `${user.name || ""} ${user.surname || ""}`.trim() || user.username
    : "Usuario";

  // 🧩 Iniciales para el avatar (ej: "JP")
  const initials = user
    ? `${(user.name?.[0] || "").toUpperCase()}${(user.surname?.[0] || "").toUpperCase()}`
    : "U";

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #E0E0E0",
        bgcolor: "#fff",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* 🔹 Logo y menú */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onMenuClick} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="primary.main">
            Clínica Modelo
          </Typography>
        </Box>

        {/* 🔹 Notificaciones y usuario */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Tooltip title="Notificaciones">
            <IconButton>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              alt={displayName}
              sx={{ bgcolor: "secondary.main", width: 36, height: 36 }}
            >
              {initials}
            </Avatar>

            <Box sx={{ textAlign: "right" }}>
              <Typography variant="body2" fontWeight={700}>
                {displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role === "ADMIN" ? "Administrador" : "Veterinario"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
