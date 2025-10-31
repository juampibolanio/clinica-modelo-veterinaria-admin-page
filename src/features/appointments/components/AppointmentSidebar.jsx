import { Paper, Stack, Typography, Divider, Chip, Button } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { STATUS_COLOR, formatStatus } from "../utils/utils";
import { appointmentStyles } from "../styles/appointment.styles";

dayjs.locale("es");

const AppointmentSidebar = ({ todayList, tomorrowList, onView }) => {
    const renderList = (title, list) => (
        <Paper sx={appointmentStyles.paperCard}>
            <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                    mb: 1,
                    background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                {title}
            </Typography>

            <Divider sx={{ mb: 2, borderColor: "rgba(55,129,227,0.15)" }} />

            {list.length === 0 ? (
                <Typography color="text.secondary" fontStyle="italic">
                    Sin turnos {title.toLowerCase()}.
                </Typography>
            ) : (
                list.map((t) => (
                    <Stack
                        key={t.id}
                        direction="row"
                        alignItems="center"
                        spacing={1.2}
                        sx={{
                            py: 0.6,
                            flexWrap: "wrap",
                        }}
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
                        <Button
                            size="small"
                            onClick={() => onView(t.id)}
                            sx={appointmentStyles.viewButton}
                        >
                            Ver
                        </Button>
                    </Stack>
                ))
            )}
        </Paper>
    );

    return (
        <Stack spacing={2} sx={{ width: { xs: "100%", md: 360 } }}>
            {renderList("Turnos de hoy", todayList)}
            {renderList("Turnos de mañana", tomorrowList)}
        </Stack>
    );
};

export default AppointmentSidebar;
