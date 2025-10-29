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
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

import { getOwnerById, patchOwner } from "../api/owners.api";
import { getPetsByOwnerId, deletePet } from "../../pets/api/pets.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";
import PetTable from "../components/PetTable";

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

    /** 🔹 Load owner + pets data */
    const fetchOwnerData = useCallback(async () => {
        try {
            const ownerData = await getOwnerById(id);
            const petData = await getPetsByOwnerId(id);
            setOwner(ownerData);
            setPets(petData);
        } catch (error) {
            console.error("Error loading owner:", error);
            enqueueSnackbar("Error al cargar la información del dueño", { variant: "error" });
            navigate("/owners");
        } finally {
            setLoading(false);
        }
    }, [id, enqueueSnackbar, navigate]);

    /** 🔹 Load recent appointments */
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
        } catch (error) {
            console.error("Error loading appointments:", error);
        } finally {
            setLoadingAppointments(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOwnerData();
        fetchAppointments();
    }, [fetchOwnerData, fetchAppointments]);

    /** Update debt */
    const handleDebtSave = async () => {
        try {
            const parsedDebt = parseFloat(newDebt);
            if (isNaN(parsedDebt) || parsedDebt < 0) {
                enqueueSnackbar("La deuda debe ser un número válido y no negativo", {
                    variant: "warning",
                });
                return;
            }

            await patchOwner(id, { totalDebt: parsedDebt });
            setOwner((prev) => ({ ...prev, totalDebt: parsedDebt }));
            enqueueSnackbar("Deuda actualizada correctamente ✅", { variant: "success" });
            setEditingDebt(false);
        } catch (error) {
            console.error("Error updating debt:", error);
            enqueueSnackbar("Error al actualizar la deuda", { variant: "error" });
        }
    };

    /** Delete pet and refresh list */
    const handleDeletePet = async (petId) => {
        try {
            await deletePet(petId);
            enqueueSnackbar("Mascota eliminada correctamente", { variant: "success" });
            setPets((prev) => prev.filter((p) => p.id !== petId));
        } catch (error) {
            console.error("Error deleting pet:", error);
            enqueueSnackbar("Error al eliminar la mascota", { variant: "error" });
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );

    if (!owner) return null;

    return (
        <Stack spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1}
                flexWrap="wrap"
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/owners")}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Detalle del cliente
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/owners/${id}/edit`)}
                    sx={{ ml: { sm: "auto" }, width: { xs: "100%", sm: "auto" } }}
                >
                    Editar
                </Button>
            </Stack>

            {/* Owner Info */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información personal
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    {[
                        ["Nombre", owner.name],
                        ["Apellido", owner.surname],
                        ["Documento", owner.documentNumber || "-"],
                        ["Email", owner.email || "-"],
                        ["Teléfono", owner.phoneNumber || "-"],
                        ["Dirección", owner.address || "-"],
                    ].map(([label, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={label}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {label}
                            </Typography>
                            <Typography variant="body1">{value}</Typography>
                        </Grid>
                    ))}

                    {/* Deuda */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Deuda total
                        </Typography>

                        {editingDebt ? (
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                <TextField
                                    size="small"
                                    type="number"
                                    value={newDebt}
                                    onChange={(e) => setNewDebt(e.target.value)}
                                    inputProps={{ min: 0, step: "0.01" }}
                                    sx={{ width: { xs: "100%", sm: 120 } }}
                                />
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton color="success" onClick={handleDebtSave}>
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setEditingDebt(false);
                                            setNewDebt("");
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        ) : (
                            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                                <Typography
                                    variant="body1"
                                    color={owner.totalDebt > 0 ? "error.main" : "success.main"}
                                >
                                    ${owner.totalDebt?.toFixed(2) || "0.00"}
                                </Typography>
                                <Tooltip title="Editar deuda">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setEditingDebt(true);
                                            setNewDebt(owner.totalDebt?.toFixed(2) || "0.00");
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Pets Section (PetTable integrado) */}
            <Stack spacing={2}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "stretch", sm: "center" }}
                    spacing={1}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Mascotas registradas
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate(`/pets/create?ownerId=${id}`)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Nueva mascota
                    </Button>
                </Stack>

                <PetTable pets={pets} onDeletePet={handleDeletePet} />
            </Stack>

            {/* Appointments Section */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1} flexWrap="wrap">
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>
                        Turnos recientes
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ ml: "auto" }}
                        onClick={() => navigate(`/appointments/create?ownerId=${id}`)}
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
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                            >
                                <Typography sx={{ minWidth: 120 }}>
                                    {dayjs(a.date).format("DD/MM/YYYY")} {a.time}
                                </Typography>
                                <Chip
                                    label={formatStatus(a.status)}
                                    size="small"
                                    color={STATUS_COLOR[a.status] || "default"}
                                />
                                <Typography flex={1}>
                                    {a.petName ? `Mascota: ${a.petName}` : "Sin mascota"}
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={() => navigate(`/appointments/${a.id}`)}
                                    sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}
                                >
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

export default OwnerDetail;
