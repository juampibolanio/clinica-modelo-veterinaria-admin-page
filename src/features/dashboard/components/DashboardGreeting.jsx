import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import { PHRASES } from "../constants/phrases";

/**
 * DashboardGreeting component displays a personalized greeting to the user along with weather information.
 * @param {Object} props - Component props.
 * @param {Object} props.user - User information.
 * @param {Object} props.weather - Weather information.
 * @returns {JSX.Element} The rendered component.
 */
const DashboardGreeting = ({ user, weather }) => {
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        background: "linear-gradient(90deg, rgba(55,129,227,0.1), rgba(112,39,160,0.1))",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: "primary.main",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          {user?.name?.[0] || "U"}
        </Avatar>

        <Box>
          <Typography variant="h5" fontWeight={800}>
            ¡Hola, {user?.name || "veterinario/a"}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {phrase}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {weather && (
          <Stack direction="row" alignItems="center" spacing={1}>
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
