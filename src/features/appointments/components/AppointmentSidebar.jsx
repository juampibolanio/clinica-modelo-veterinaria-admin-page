import { Paper, Stack, Typography, Divider, Chip, Button } from "@mui/material";
import dayjs from "dayjs";
import { STATUS_COLOR, formatStatus } from "../utils/utils";

/**
 * Sidebar showing today's and tomorrow's appointments
 * Props:
 * - todayList: Array of appointments for today
 * - tomorrowList: Array of appointments for tomorrow
 * - onView: Function to call when "View" button is clicked (receives appointment ID)
 * 
 */
const AppointmentSidebar = ({ todayList, tomorrowList, onView }) => {
    const renderList = (title, list) => (
        <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                {title}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {list.length === 0 ? (
                <Typography color="text.secondary">Sin turnos {title.toLowerCase()}.</Typography>
            ) : (
                list.map((t) => (
                    <Stack
                        key={t.id}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{ py: 0.5, flexWrap: "wrap" }}
                    >
                        <Chip
                            size="small"
                            label={dayjs(`${t.date}T${t.time}`).format("HH:mm")}
                        />
                        <Typography flex={1}>
                            {t.petName} • {t.veterinarianName}
                        </Typography>
                        <Chip
                            size="small"
                            color={STATUS_COLOR[t.status] || "default"}
                            label={formatStatus(t.status)}
                        />
                        <Button size="small" onClick={() => onView(t.id)}>
                            Ver
                        </Button>
                    </Stack>
                ))
            )}
        </Paper>
    );

    return (
        <Stack spacing={2} sx={{ width: { xs: "100%", md: 360 } }}>
            {renderList("Hoy", todayList)}
            {renderList("Mañana", tomorrowList)}
        </Stack>
    );
};

export default AppointmentSidebar;
