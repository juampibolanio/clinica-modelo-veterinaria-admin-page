import { useEffect, useMemo, useState } from "react";
import {
    Box,
    Paper,
    Stack,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
    STATUS_COLOR,
    formatStatus,
    toISOFromBackend,
} from "../utils/utils";
import { listAppointments, deleteAppointment } from "../api/appointments.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { getAllUsers } from "../../users/api/users.api";

const Appointments = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [filters, setFilters] = useState({
        veterinarianId: "",
        status: "",
        fromDate: "",
        toDate: "",
        page: 0,
        size: 100,
        sortBy: "date",
        direction: "asc",
    });

    const [vets, setVets] = useState([]);
    const [pageData, setPageData] = useState({ content: [] });
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await listAppointments(filters);
            setPageData(data);
        } catch {
            enqueueSnackbar("Error al cargar turnos", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const users = await getAllUsers();
                setVets(users);
            } catch { }
        })();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters.page, filters.size, filters.sortBy, filters.direction]);

    const events = useMemo(
        () =>
            (pageData?.content || []).map((a) => ({
                id: String(a.id),
                title: `${a.petName} • ${a.veterinarianName}${a.reason ? " • " + a.reason : ""
                    }`,
                start: toISOFromBackend(a.date, a.time),
                end: toISOFromBackend(a.date, a.time),
                extendedProps: a,
            })),
        [pageData]
    );

    const todayStr = dayjs().format("YYYY-MM-DD");
    const tomorrowStr = dayjs().add(1, "day").format("YYYY-MM-DD");
    const todayList = (pageData?.content || []).filter(
        (a) => a.date === todayStr
    );
    const tomorrowList = (pageData?.content || []).filter(
        (a) => a.date === tomorrowStr
    );

    const handleDateSelect = (selInfo) => {
        const date = dayjs(selInfo.startStr).format("YYYY-MM-DD");
        const time = dayjs(selInfo.startStr).format("HH:mm");
        navigate(`/appointments/create?date=${date}&time=${time}`);
    };

    const handleEventClick = (clickInfo) => {
        const id = clickInfo.event.id;
        navigate(`/appointments/${id}`);
    };

    const askDelete = (id) => {
        setSelectedId(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteAppointment(selectedId);
            enqueueSnackbar("Turno eliminado", { variant: "success" });
            fetchData();
        } catch {
            enqueueSnackbar("No se pudo eliminar", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Typography variant="h4" fontWeight={800}>
                    Turnos
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
            </Stack>

            {/* Filtros */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                    <TextField
                        select
                        label="Veterinario"
                        size="small"
                        value={filters.veterinarianId}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                veterinarianId: e.target.value,
                                page: 0,
                            }))
                        }
                        sx={{ minWidth: 220 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        {vets.map((v) => (
                            <MenuItem key={v.id} value={v.id}>
                                {v.name} {v.surname}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Estado"
                        size="small"
                        value={filters.status}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                status: e.target.value,
                                page: 0,
                            }))
                        }
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value="">Todos</MenuItem>
                        <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                        <MenuItem value="CONFIRMADO">Confirmado</MenuItem>
                        <MenuItem value="CANCELADO">Cancelado</MenuItem>
                        <MenuItem value="ATENDIDO">Atendido</MenuItem>
                    </TextField>

                    <TextField
                        type="date"
                        label="Desde"
                        size="small"
                        value={filters.fromDate || ""}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                fromDate: e.target.value,
                                page: 0,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        label="Hasta"
                        size="small"
                        value={filters.toDate || ""}
                        onChange={(e) =>
                            setFilters((f) => ({
                                ...f,
                                toDate: e.target.value,
                                page: 0,
                            }))
                        }
                        InputLabelProps={{ shrink: true }}
                    />

                    <Button variant="outlined" onClick={fetchData}>
                        Aplicar
                    </Button>
                </Stack>
            </Paper>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Paper sx={{ p: 2, borderRadius: 2, flex: 1, minWidth: 0 }}>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        selectable
                        selectMirror
                        select={handleDateSelect}
                        eventClick={handleEventClick}
                        events={events}
                        height="auto"
                        businessHours={[
                            { daysOfWeek: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "12:30" },
                            { daysOfWeek: [1, 2, 3, 4, 5], startTime: "17:00", endTime: "20:00" },
                            { daysOfWeek: [6], startTime: "09:00", endTime: "12:30" },
                            { daysOfWeek: [6], startTime: "18:00", endTime: "20:00" },
                        ]}
                        weekends={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="21:00:00"
                        allDaySlot={false}
                        nowIndicator
                        slotLabelFormat={{
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        }}
                    />
                </Paper>

                {/* Panel lateral Hoy / Mañana */}
                <Stack spacing={2} sx={{ width: { xs: "100%", md: 360 } }}>
                    {/* Hoy */}
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Hoy
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        {todayList.length === 0 && (
                            <Typography color="text.secondary">
                                Sin turnos hoy.
                            </Typography>
                        )}
                        {todayList.map((t) => (
                            <Stack
                                key={t.id}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ py: 0.5 }}
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
                                    onClick={() => navigate(`/appointments/${t.id}`)}
                                >
                                    Ver
                                </Button>
                            </Stack>
                        ))}
                    </Paper>

                    {/* Mañana */}
                    <Paper sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                            Mañana
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        {tomorrowList.length === 0 && (
                            <Typography color="text.secondary">
                                Sin turnos mañana.
                            </Typography>
                        )}
                        {tomorrowList.map((t) => (
                            <Stack
                                key={t.id}
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                sx={{ py: 0.5 }}
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
                                    onClick={() => navigate(`/appointments/${t.id}`)}
                                >
                                    Ver
                                </Button>
                            </Stack>
                        ))}
                    </Paper>
                </Stack>
            </Stack>

            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar turno"
                message="¿Seguro que deseas eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
        </Stack>
    );
};

export default Appointments;
