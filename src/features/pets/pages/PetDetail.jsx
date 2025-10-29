import React, { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    Grid,
    CircularProgress,
    Button,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VaccinesIcon from "@mui/icons-material/HealthAndSafetyRounded";
import FeedIcon from "@mui/icons-material/FeedRounded";
import { useNavigate, useParams } from "react-router-dom";
import { getPetById } from "../api/pets.api";
import { listClinicalHistory } from "../../clinical-history/api/clinical-history.api";
import { listAppliedVaccines } from "../../applied-vaccines/api/applied-vaccines.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    const [histories, setHistories] = useState([]);
    const [loadingHistories, setLoadingHistories] = useState(true);

    const [vaccines, setVaccines] = useState([]);
    const [loadingVaccines, setLoadingVaccines] = useState(true);

    const [appointments, setAppointments] = useState([]);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    const fetchPetData = async () => {
        try {
            const data = await getPetById(id);
            setPet(data);
        } catch {
            enqueueSnackbar("Error al cargar la información de la mascota", { variant: "error" });
            navigate("/pets");
        } finally {
            setLoading(false);
        }
    };

    const fetchHistories = async () => {
        try {
            setLoadingHistories(true);
            const data = await listClinicalHistory({ petId: id, page: 0, size: 5, sortBy: "date", direction: "desc" });
            setHistories(data.content || []);
        } finally {
            setLoadingHistories(false);
        }
    };

    const fetchVaccines = async () => {
        try {
            setLoadingVaccines(true);
            const data = await listAppliedVaccines({ petId: id, page: 0, size: 5, sortBy: "date", direction: "desc" });
            setVaccines(data.content || []);
        } finally {
            setLoadingVaccines(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoadingAppointments(true);
            const data = await listAppointments({ petId: id, page: 0, size: 5, sortBy: "date", direction: "desc" });
            setAppointments(data.content || []);
        } finally {
            setLoadingAppointments(false);
        }
    };

    useEffect(() => {
        fetchPetData();
        fetchHistories();
        fetchVaccines();
        fetchAppointments();
    }, [id]);

    const translateGender = (value) => {
        if (value === "MALE") return "Macho";
        if (value === "FEMALE") return "Hembra";
        return "-";
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return "-";
        const now = dayjs();
        const birth = dayjs(birthDate);
        const years = now.diff(birth, "year");

        if (years >= 1) return `${years} ${years === 1 ? "año" : "años"}`;
        const months = now.diff(birth, "month");
        if (months >= 1) return `${months} ${months === 1 ? "mes" : "meses"}`;
        const days = now.diff(birth, "day");
        return `${days} ${days === 1 ? "día" : "días"}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) return null;

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/pets")}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Detalle de la mascota
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/pets/${id}/edit`)}
                    sx={{ ml: "auto" }}
                >
                    Editar
                </Button>
            </Stack>

            {/* Datos generales */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Nombre</Typography>
                        <Typography variant="body1">{pet.name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Especie</Typography>
                        <Typography variant="body1">{pet.species}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Raza</Typography>
                        <Typography variant="body1">{pet.breed || "-"}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Género</Typography>
                        <Typography variant="body1">{translateGender(pet.gender)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Color</Typography>
                        <Typography variant="body1">{pet.color || "-"}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Peso</Typography>
                        <Typography variant="body1">{pet.weight} kg</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Fecha de nacimiento</Typography>
                        <Typography variant="body1">
                            {pet.birthDate ? dayjs(pet.birthDate).format("DD/MM/YYYY") : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Edad</Typography>
                        <Typography variant="body1">{calculateAge(pet.birthDate)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">Alergias</Typography>
                        <Typography variant="body1">{pet.allergies || "Ninguna"}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Dueño */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>Dueño</Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">
                        ID del dueño:{" "}
                        <Typography component="span" fontWeight={700}>#{pet.ownerId}</Typography>
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate(`/owners/${pet.ownerId}`)}
                    >
                        Ver información del dueño
                    </Button>
                </Stack>
            </Paper>

            {/* Historias clínicas */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <FeedIcon />
                    <Typography variant="h6" fontWeight={700}>Historias clínicas</Typography>
                    <Button variant="contained" sx={{ ml: "auto" }} onClick={() => navigate(`/clinical-history/create?petId=${id}`)}>
                        Nueva historia
                    </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {loadingHistories ? (
                    <CircularProgress />
                ) : histories.length === 0 ? (
                    <Typography color="text.secondary">No hay historias clínicas.</Typography>
                ) : (
                    histories.map((h) => (
                        <Box key={h.id} sx={{ py: 1 }}>
                            <Stack direction="row" spacing={2}>
                                <Typography sx={{ minWidth: 120 }}>{dayjs(h.date).format("DD/MM/YYYY")}</Typography>
                                <Typography sx={{ minWidth: 160, fontWeight: 700 }}>{h.consultationType}</Typography>
                                <Typography flex={1}>{h.consultationReason}</Typography>
                                <Button size="small" onClick={() => navigate(`/clinical-history/${h.id}`)}>Ver</Button>
                            </Stack>
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    ))
                )}
            </Paper>

            {/* Vacunas aplicadas */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <VaccinesIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Vacunas aplicadas</Typography>
                    <Button variant="contained" sx={{ ml: "auto" }} onClick={() => navigate(`/applied-vaccines/create?petId=${id}`)}>
                        Nueva vacuna
                    </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {loadingVaccines ? (
                    <CircularProgress />
                ) : vaccines.length === 0 ? (
                    <Typography color="text.secondary">No hay vacunas registradas.</Typography>
                ) : (
                    vaccines.map((v) => (
                        <Box key={v.id} sx={{ py: 1 }}>
                            <Stack direction="row" spacing={2}>
                                <Typography sx={{ minWidth: 120 }}>{dayjs(v.date).format("DD/MM/YYYY")}</Typography>
                                <Typography sx={{ minWidth: 160, fontWeight: 700 }}>{v.productName}</Typography>
                                <Typography flex={1}>{v.veterinarianName}</Typography>
                                <Button size="small" onClick={() => navigate(`/applied-vaccines/${v.id}`)}>Ver</Button>
                            </Stack>
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    ))
                )}
            </Paper>

            {/* Turnos */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Turnos</Typography>
                    <Button
                        variant="contained"
                        sx={{ ml: "auto" }}
                        onClick={() => navigate(`/appointments/create?petId=${id}`)}
                    >
                        Nuevo turno
                    </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {loadingAppointments ? (
                    <CircularProgress />
                ) : appointments.length === 0 ? (
                    <Typography color="text.secondary">No hay turnos registrados.</Typography>
                ) : (
                    appointments.map((a) => (
                        <Box key={a.id} sx={{ py: 1 }}>
                            <Stack direction="row" spacing={2}>
                                <Typography sx={{ minWidth: 120 }}>
                                    {dayjs(a.date).format("DD/MM/YYYY")} {a.time}
                                </Typography>
                                <Chip
                                    label={formatStatus(a.status)}
                                    size="small"
                                    color={STATUS_COLOR[a.status] || "default"}
                                />
                                <Typography flex={1}>{a.reason || "Sin motivo"}</Typography>
                                <Button size="small" onClick={() => navigate(`/appointments/${a.id}`)}>
                                    Ver
                                </Button>
                            </Stack>
                            <Divider sx={{ mt: 1 }} />
                        </Box>
                    ))
                )}
            </Paper>
        </Stack>
    );
};

export default PetDetail;
