import { useEffect, useState } from "react";
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
import PetsIcon from "@mui/icons-material/PetsRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { getOwnerById } from "../../owners/api/owners.api";
import { getPetsByOwnerId } from "../../pets/api/pets.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { SectionList } from "../components/SectionList";

import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";

/**
 * OwnerDetail
 * Displays owner information, their pets, and recent appointments.
 */
const OwnerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);

    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [loadingPets, setLoadingPets] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    // ==============================
    // Data Fetchers
    // ==============================
    const fetchOwner = async () => {
        try {
            const data = await getOwnerById(id);
            setOwner(data);
        } catch {
            enqueueSnackbar("Error al cargar la información del dueño", { variant: "error" });
            navigate("/owners");
        } finally {
            setLoading(false);
        }
    };

    const fetchPets = async () => {
        try {
            setLoadingPets(true);
            const data = await getPetsByOwnerId(id);
            setPets(data || []);
        } finally {
            setLoadingPets(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoadingAppointments(true);
            const data = await listAppointments({
                ownerId: id,
                page: 0,
                size: 5,
                sortBy: "date",
                direction: "desc",
            });
            setAppointments(data.content || []);
        } finally {
            setLoadingAppointments(false);
        }
    };

    useEffect(() => {
        fetchOwner();
        fetchPets();
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // ==============================
    // UI
    // ==============================
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!owner) return null;

    return (
        <Stack spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
            {/*  Header  */}
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/owners")}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Detalle del dueño
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/owners/${id}/edit`)}
                    sx={{ ml: "auto" }}
                >
                    Editar
                </Button>
            </Stack>

            {/*  General Information  */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    {[
                        { label: "Nombre", value: owner.name },
                        { label: "Apellido", value: owner.surname },
                        { label: "Email", value: owner.email },
                        { label: "Teléfono", value: owner.phoneNumber },
                        { label: "Documento", value: owner.documentNumber },
                        {
                            label: "Deuda",
                            value: owner.debt
                                ? `$${Number(owner.debt).toFixed(2)}`
                                : "$0.00",
                        },
                    ].map((item) => (
                        <Grid key={item.label} item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="body1">{item.value}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/*  Pets Section  */}
            <SectionList
                icon={<PetsIcon color="primary" />}
                title="Mascotas"
                items={pets}
                loading={loadingPets}
                emptyText="Este dueño no tiene mascotas registradas."
                createLabel="Nueva mascota"
                onCreate={() => navigate(`/pets/create?ownerId=${id}`)}
                renderItem={(p) => (
                    <>
                        <Typography sx={{ minWidth: 160, fontWeight: 700 }}>
                            {p.name}
                        </Typography>
                        <Typography sx={{ minWidth: 140 }}>
                            {p.species} - {p.breed || "-"}
                        </Typography>
                        <Typography sx={{ minWidth: 100 }}>
                            {p.gender === "MALE"
                                ? "Macho"
                                : p.gender === "FEMALE"
                                    ? "Hembra"
                                    : "-"}
                        </Typography>
                        <Typography flex={1}>
                            {p.weight ? `${p.weight} kg` : "-"}
                        </Typography>
                        <Button
                            size="small"
                            onClick={() => navigate(`/pets/${p.id}`)}
                        >
                            Ver
                        </Button>
                    </>
                )}
            />

            {/*  Appointments Section  */}
            <SectionList
                icon={<CalendarMonthIcon color="primary" />}
                title="Turnos recientes"
                items={appointments}
                loading={loadingAppointments}
                emptyText="No hay turnos registrados para este dueño."
                createLabel="Nuevo turno"
                onCreate={() => navigate(`/appointments/create?ownerId=${id}`)}
                renderItem={(a) => (
                    <>
                        <Typography sx={{ minWidth: 120 }}>
                            {dayjs(a.date).format("DD/MM/YYYY")} {a.time}
                        </Typography>
                        <Chip
                            label={formatStatus(a.status)}
                            size="small"
                            color={STATUS_COLOR[a.status] || "default"}
                        />
                        <Typography flex={1}>{a.reason || "Sin motivo"}</Typography>
                        <Button
                            size="small"
                            onClick={() => navigate(`/appointments/${a.id}`)}
                        >
                            Ver
                        </Button>
                    </>
                )}
            />
        </Stack>
    );
};

export default OwnerDetail;
