import { AppBar, Box, IconButton, Toolbar, Typography, Avatar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { topbarStyles } from "./styles/topbar.styles";

/**
 * Topbar component that displays the application title and user information.
 * @param {function} onMenuClick - Function to be called when the menu button is clicked (for mobile view).
 * @returns {JSX.Element} The Topbar component.
 */
const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  const displayName = user
    ? `${user.name || ""} ${user.surname || ""}`.trim() || user.username
    : "Usuario";

  const initials = user
    ? `${(user.name?.[0] || "").toUpperCase()}${(user.surname?.[0] || "").toUpperCase()}`
    : "U";

  return (
    <AppBar elevation={0} sx={topbarStyles.appBar}>
      <Toolbar sx={topbarStyles.toolbar}>
        {/* Menu and logo */}
        <Box sx={topbarStyles.logoContainer}>
          <IconButton onClick={onMenuClick} sx={topbarStyles.menuButton}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={topbarStyles.logoText}>
            Clínica Modelo
          </Typography>
        </Box>

        {/* User info */}
        <Box sx={topbarStyles.userSection}>
          {/* Desktop user info */}
          <Box sx={topbarStyles.userInfoContainer}>
            <Avatar alt={displayName} sx={topbarStyles.avatar}>
              {initials}
            </Avatar>
            <Box sx={topbarStyles.userInfoText}>
              <Typography sx={topbarStyles.userName}>
                {displayName}
              </Typography>
              <Typography sx={topbarStyles.userRole}>
                {user?.role === "ADMIN" ? "Administrador" : "Veterinario"}
              </Typography>
            </Box>
          </Box>

          {/* Mobile avatar only */}
          <Avatar alt={displayName} sx={topbarStyles.avatarMobile}>
            {initials}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;