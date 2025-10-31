import { Avatar, Box, Paper, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { PHRASES } from "../constants/phrases";

/**
 * DashboardGreeting component displays a personalized greeting to the user along with weather information.
 * @param {Object} props - Component props.
 * @param {Object} props.user - User information.
 * @param {Object} props.weather - Weather information.
 * @returns {JSX.Element} The rendered component.
 */
const DashboardGreeting = ({ user, weather }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        background:
          "linear-gradient(90deg, rgba(55,129,227,0.1), rgba(112,39,160,0.1))",
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        alignItems={isMobile ? "flex-start" : "center"}
        spacing={isMobile ? 2 : 3}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: isMobile ? 56 : 64,
            height: isMobile ? 56 : 64,
            bgcolor: "primary.main",
            fontSize: isMobile ? 24 : 28,
            fontWeight: 700,
            alignSelf: isMobile ? "center" : "flex-start",
          }}
        >
          {user?.name?.[0] || "U"}
        </Avatar>

        {/* Greeting text */}
        <Box flex={1}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={800}
            sx={{
              textAlign: isMobile ? "center" : "left",
              lineHeight: 1.3,
            }}
          >
            ¡Hola, {user?.name || "veterinario/a"}! 👋
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: isMobile ? "center" : "left" }}
          >
            {phrase}
          </Typography>
        </Box>

        {/* Weather info */}
        {weather && (
          <Stack
            direction={isMobile ? "row" : "column"}
            alignItems={isMobile ? "center" : "flex-end"}
            spacing={isMobile ? 1 : 0.5}
            sx={{
              mt: isMobile ? 2 : 0,
              alignSelf: isMobile ? "center" : "flex-start",
            }}
          >
            <Typography variant="body1" fontWeight={600}>
              {weather.temperature}°C
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resistencia | Chaco
            </Typography>
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default DashboardGreeting;
