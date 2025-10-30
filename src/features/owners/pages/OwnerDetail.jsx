import { useEffect, useState, useCallback } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    Grid,
    CircularProgress,
    Button,
    IconButton,
    Tooltip,
    TextField,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import { getOwnerById, patchOwner } from "../api/owners.api";
import { getPetsByOwnerId, deletePet } from "../../pets/api/pets.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";
import PetTable from "../components/PetTable";
import { ownerDetailStyles } from "../styles/ownerDetail.styles";

const OwnerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [owner, setOwner] = useState(null);
    const [pets, setPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [editingDebt, setEditingDebt] = useState(false);
    const [newDebt, setNewDebt] = useState("");

    const fetchOwnerData = useCallback(async () => {
        try {
            const ownerData = await getOwnerById(id);
            const petData = await getPetsByOwnerId(id);
            setOwner(ownerData);
            setPets(petData);
        } catch {
            enqueueSnackbar("Error al cargar la información del cliente", { variant: "error" });
            navigate("/owners");
        } finally {
            setLoading(false);
        }
    }, [id, enqueueSnackbar, navigate]);

    const fetchAppointments = useCallback(async () => {
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
    }, [id]);

    useEffect(() => {
        fetchOwnerData();
        fetchAppointments();
    }, [fetchOwnerData, fetchAppointments]);

    const handleDebtSave = async () => {
        try {
            const parsed = parseFloat(newDebt);
            if (isNaN(parsed) || parsed < 0) {
                enqueueSnackbar("Ingrese una deuda válida y no negativa", { variant: "warning" });
                return;
            }
            await patchOwner(id, { totalDebt: parsed });
            setOwner((prev) => ({ ...prev, totalDebt: parsed }));
            enqueueSnackbar("Deuda actualizada correctamente ✅", { variant: "success" });
            setEditingDebt(false);
        } catch {
            enqueueSnackbar("Error al actualizar la deuda", { variant: "error" });
        }
    };

    const handleDeletePet = async (petId) => {
        try {
            await deletePet(petId);
            enqueueSnackbar("Mascota eliminada correctamente", { variant: "success" });
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch {
            enqueueSnackbar("Error al eliminar la mascota", { variant: "error" });
        }
    };

    if (loading)
        return (
            <Box sx={ownerDetailStyles.loadingBox}>
                <CircularProgress />
            </Box>
        );

    if (!owner) return null;

    return (
        <Stack sx={ownerDetailStyles.container}>
            {/* Header */}
            <Stack sx={ownerDetailStyles.header}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/owners")}
                    sx={ownerDetailStyles.backButton}
                >
                    Volver
                </Button>

                <Typography variant="h4" sx={ownerDetailStyles.title}>
                    Detalle del Cliente
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/owners/${id}/edit`)}
                    sx={ownerDetailStyles.editButton}
                >
                    Editar
                </Button>
            </Stack>

            {/* Owner Info */}
            <Paper elevation={0} sx={ownerDetailStyles.infoPaper}>
                <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                    <PersonIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                    <Typography sx={ownerDetailStyles.sectionTitle}>Información Personal</Typography>
                </Stack>
                <Divider sx={ownerDetailStyles.divider} />

                <Grid container spacing={3}>
                    {[
                        ["Nombre", owner.name],
                        ["Apellido", owner.surname],
                        ["Documento", owner.documentNumber || "-"],
                        ["Email", owner.email || "-"],
                        ["Teléfono", owner.phoneNumber || "-"],
                        ["Dirección", owner.address || "-"],
                    ].map(([label, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={label}>
                            <Typography sx={ownerDetailStyles.infoLabel}>{label}</Typography>
                            <Typography sx={ownerDetailStyles.infoValue}>{value}</Typography>
                        </Grid>
                    ))}

                    {/* Deuda */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={ownerDetailStyles.infoLabel}>Deuda Total</Typography>
                        {editingDebt ? (
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <TextField
                                    size="small"
                                    type="number"
                                    value={newDebt}
                                    onChange={(e) => setNewDebt(e.target.value)}
                                    inputProps={{ min: 0, step: "0.01" }}
                                    sx={ownerDetailStyles.debtField}
                                />
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton color="success" onClick={handleDebtSave} sx={ownerDetailStyles.iconButton}>
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setEditingDebt(false);
                                            setNewDebt("");
                                        }}
                                        sx={ownerDetailStyles.iconButton}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        ) : (
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography sx={ownerDetailStyles.debtValue(owner.totalDebt > 0)}>
                                    ${owner.totalDebt?.toFixed(2) || "0.00"}
                                </Typography>
                                <Tooltip title="Editar deuda" arrow>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setEditingDebt(true);
                                            setNewDebt(owner.totalDebt?.toFixed(2) || "0.00");
                                        }}
                                        sx={ownerDetailStyles.iconButton}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Pets Section */}
            <Stack spacing={3}>
                <Stack sx={ownerDetailStyles.petsHeader}>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/pets/create?ownerId=${id}`)}
                        sx={ownerDetailStyles.addPetButton}
                    >
                        Nueva mascota
                    </Button>
                </Stack>
                <PetTable pets={pets} onDeletePet={handleDeletePet} />
            </Stack>

            {/* Appointments Section */}
            <Paper elevation={0} sx={ownerDetailStyles.appointmentsPaper}>
                <Stack sx={ownerDetailStyles.appointmentsHeader}>
                    <CalendarMonthIcon sx={{ color: "primary.main", fontSize: "1.5rem" }} />
                    <Typography sx={ownerDetailStyles.appointmentsTitle}>Turnos Recientes</Typography>
                    <Button
                        variant="contained"
                        sx={ownerDetailStyles.addAppointmentButton}
                        onClick={() => navigate(`/appointments/create?ownerId=${id}`)}
                    >
                        Nuevo turno
                    </Button>
                </Stack>
                <Divider sx={ownerDetailStyles.divider} />
                {loadingAppointments ? (
                    <Box sx={{ textAlign: "center", py: 3 }}>
                        <CircularProgress size={32} />
                    </Box>
                ) : appointments.length === 0 ? (
                    <Box sx={ownerDetailStyles.emptyState}>
                        <Typography sx={ownerDetailStyles.emptyText}>No hay turnos registrados</Typography>
                    </Box>
                ) : (
                    appointments.map((a, i) => (
                        <Box key={a.id} sx={ownerDetailStyles.appointmentItem}>
                            <Stack sx={ownerDetailStyles.appointmentRow}>
                                <Typography sx={ownerDetailStyles.appointmentDate}>
                                    {dayjs(a.date).format("DD/MM/YYYY")} {a.time}
                                </Typography>
                                <Chip label={formatStatus(a.status)} size="small" color={STATUS_COLOR[a.status] || "default"} />
                                <Typography sx={ownerDetailStyles.appointmentInfo}>
                                    {a.petName ? `Mascota: ${a.petName}` : "Sin mascota"}
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/appointments/${a.id}`)}
                                    sx={ownerDetailStyles.viewButton}
                                >
                                    Ver
                                </Button>
                            </Stack>
                            {i < appointments.length - 1 && <Divider sx={{ mt: 2 }} />}
                        </Box>
                    ))
                )}
            </Paper>
        </Stack>
    );
};

export default OwnerDetail;
