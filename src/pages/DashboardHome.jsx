import { useEffect, useState, useMemo } from "react";
import {
    Box,
    Grid,
    Paper,
    Stack,
    Typography,
    CircularProgress,
    Divider,
    Chip,
    Avatar,
} from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CloudIcon from "@mui/icons-material/Cloud";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useSnackbar } from "notistack";
import { useAuth } from "../features/auth/AuthContext";
import { listAppointments } from "../features/appointments/api/appointments.api";
import { getProducts } from "../features/products/api/products.api";
import { getDashboardStats } from "../libs/dashboard.api";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const QUOTES = [
    "El amor por los animales eleva la naturaleza humana.",
    "Cuidar a quien no puede hablar es el mayor acto de empatía.",
    "Un veterinario no cura solo animales, sino también corazones.",
    "Los animales hacen del mundo un lugar mejor, nosotros solo cuidamos su magia.",
    "Cada paciente peludo deja una huella imborrable en el alma.",
];

const DashboardHome = () => {
    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [appointments, setAppointments] = useState([]);
    const [weeklyAppointments, setWeeklyAppointments] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const quote = useMemo(
        () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
        []
    );

    // 🩺 Cargar datos del dashboard
    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = dayjs();
                const startOfWeek = today.startOf("week").add(1, "day");
                const endOfWeek = today.endOf("week").add(1, "day");

                const [appointmentsRes, weeklyRes, productsRes, statsRes] =
                    await Promise.all([
                        listAppointments({
                            veterinarianId: user?.id,
                            fromDate: today.format("YYYY-MM-DD"),
                            toDate: today.format("YYYY-MM-DD"),
                            sortBy: "time",
                            direction: "asc",
                        }),
                        listAppointments({
                            veterinarianId: user?.id,
                            fromDate: startOfWeek.format("YYYY-MM-DD"),
                            toDate: endOfWeek.format("YYYY-MM-DD"),
                        }),
                        getProducts(),
                        getDashboardStats(),
                    ]);

                setAppointments(appointmentsRes.content || appointmentsRes);
                setWeeklyAppointments(weeklyRes.content || weeklyRes);

                const allProducts = productsRes.content || productsRes;
                const lowStock = allProducts.filter((p) => p.stock < 5);
                setLowStockProducts(lowStock);

                setStats(statsRes);
            } catch (err) {
                enqueueSnackbar("Error al cargar datos del dashboard", {
                    variant: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) fetchData();
    }, [user]);

    // ☀️ Clima de Resistencia
    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=-27.45&longitude=-58.98&current_weather=true&timezone=auto"
                );
                const data = await res.json();
                if (data?.current_weather) setWeather(data.current_weather);
            } catch {
                setWeather(null);
            }
        };
        fetchWeather();
    }, []);

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );

    const isSunny = weather && weather.weathercode < 3;

    // 📅 Agrupar turnos de la semana
    const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
    const groupedByDay = weekDays.map((label, i) => {
        const count = weeklyAppointments.filter(
            (a) => dayjs(a.date).day() === (i + 1) % 7
        ).length;
        return { label, count };
    });

    return (
        <Stack spacing={3}>
            {/* 👋 Bienvenida */}
            <Paper
                sx={{
                    p: 3,
                    borderRadius: 2,
                    background:
                        "linear-gradient(90deg, rgba(55,129,227,0.1), rgba(112,39,160,0.1))",
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
                            {quote}
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {weather && (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body1" fontWeight={600}>
                                {weather.temperature}°C
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Resistencia, Chaco
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            </Paper>

            {/* 📅 Turnos de hoy */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <EventAvailableIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Mis turnos de hoy
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {appointments.length === 0 ? (
                    <Typography color="text.secondary">
                        No tenés turnos registrados hoy.
                    </Typography>
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

            {/* 📅 Turnos de la semana */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Turnos de esta semana
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" justifyContent="space-around">
                    {groupedByDay.map((d) => (
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

            {/* 💊 Productos con poco stock */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <InventoryIcon color="error" />
                    <Typography variant="h6" fontWeight={700}>
                        Productos con poco stock
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {lowStockProducts.length === 0 ? (
                    <Typography color="text.secondary">
                        Todo el stock está en orden.
                    </Typography>
                ) : (
                    <Stack spacing={1}>
                        {lowStockProducts.map((p) => (
                            <Stack
                                key={p.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                    bgcolor: "rgba(227,55,55,0.05)",
                                    p: 1,
                                    borderRadius: 1,
                                }}
                            >
                                <Typography>{p.name}</Typography>
                                <Typography color="error.main" fontWeight={700}>
                                    {p.stock} u.
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                )}
            </Paper>

            {/* 📈 Resumen del mes */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <AssessmentIcon color="secondary" />
                    <Typography variant="h6" fontWeight={700}>
                        Resumen del mes
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    {[
                        { label: "Turnos atendidos", value: stats?.appointmentsThisMonth || 0 },
                        { label: "Vacunas aplicadas", value: stats?.vaccinesApplied || 0 },
                        { label: "Mascotas atendidas", value: stats?.totalPets || 0 },
                    ].map((item, i) => (
                        <Grid item xs={12} sm={4} key={i}>
                            <Box textAlign="center">
                                <Typography variant="h5" fontWeight={700}>
                                    {item.value}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.label}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Stack>
    );
};

export default DashboardHome;
