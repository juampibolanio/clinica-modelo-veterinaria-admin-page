import { Paper, Stack, Typography, Divider, Chip } from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import dayjs from "dayjs";

/**
 * DashboardTodayAppointments component displays today's appointments.
 * @param {Object} props - Component props.
 * @param {Array} props.appointments - Array of today's appointments.
 * @return {JSX.Element} The rendered component.
 */
const DashboardTodayAppointments = ({ appointments }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <EventAvailableIcon color="primary" />
            <Typography variant="h6" fontWeight={700}>
                Mis turnos de hoy
            </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {appointments.length === 0 ? (
            <Typography color="text.secondary">No tenés turnos registrados hoy.</Typography>
        ) : (
            <Stack spacing={1}>
                {appointments.map((a) => (
                    <Stack
                        key={a.id}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(55,129,227,0.05)",
                        }}
                    >
                        <Chip
                            label={dayjs(`${a.date}T${a.time}`).format("HH:mm")}
                            color="primary"
                            size="small"
                        />
                        <Typography flex={1}>
                            <b>{a.petName}</b> — {a.ownerName}
                        </Typography>
                        <Typography color="text.secondary">
                            {a.reason || "Consulta general"}
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        )}
    </Paper>
);

export default DashboardTodayAppointments;
