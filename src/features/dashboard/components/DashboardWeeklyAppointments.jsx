import { Paper, Stack, Typography, Divider, Box } from "@mui/material";
import { groupAppointmentsByDay } from "../utils/day-of-the-week";

/**
 * DashboardWeeklyAppointments component displays the number of appointments for each day of the current week.
 * @param {Object} props - Component props.
 * @param {Array} props.weeklyAppointments - Array of this week's appointments.
 * @return {JSX.Element} The rendered component.
 */
const DashboardWeeklyAppointments = ({ weeklyAppointments }) => {
    const grouped = groupAppointmentsByDay(weeklyAppointments);

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                Turnos de esta semana
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack direction="row" justifyContent="space-around">
                {grouped.map((d) => (
                    <Box key={d.label} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            {d.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={700}>
                            {d.count}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};

export default DashboardWeeklyAppointments;
