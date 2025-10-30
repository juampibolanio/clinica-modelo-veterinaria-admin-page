import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    Button,
    CircularProgress,
    Chip,
    Grid,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getAppointmentById, deleteAppointment } from "../api/appointments.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import dayjs from "dayjs";
import { formatStatus, STATUS_COLOR } from "../utils/utils";

/**
 * AppointmentDetail Page
 * Displays complete appointment info with actions to edit or delete.
 */
const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    /**
     * Fetch appointment detail from backend
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAppointmentById(id);
                setAppointment(data);
            } catch (err) {
                console.error("Error al cargar turno:", err);
                enqueueSnackbar("Error al cargar el turno", { variant: "error" });
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, enqueueSnackbar, navigate]);

    /**
     * Handle appointment deletion
     */
    const handleDelete = async () => {
        try {
            await deleteAppointment(id);
            enqueueSnackbar("Turno eliminado correctamente ✅", { variant: "success" });
            navigate("/appointments");
        } catch (err) {
            console.error("Error al eliminar turno:", err);
            enqueueSnackbar("No se pudo eliminar el turno", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    /**
     * Loading state
     */
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
                <CircularProgress />
            </Box>
        );
    }

    if (!appointment) return null;

    const {
        date,
        time,
        status,
        veterinarianName,
        veterinarianId,
        ownerName,
        ownerId,
        petName,
        petId,
        reason,
        notes,
    } = appointment;

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "flex-start", sm: "center" }}
                justifyContent="space-between"
                spacing={2}
                flexWrap="wrap"
            >
                <Typography variant="h4" fontWeight={800}>
                    Detalle del Turno
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {/* ✅ Pasa el turno completo al editar */}
                    <Button
                        variant="outlined"
                        onClick={() => navigate(`/appointments/${id}/edit`, { state: { appointment } })}
                    >
                        Editar
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Eliminar
                    </Button>
                </Stack>
            </Stack>

            {/* Appointment Information */}
            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Fecha:</strong>{" "}
                            {date ? dayjs(date).format("DD/MM/YYYY") : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Hora:</strong> {time?.slice(0, 5) || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>
                                <strong>Estado:</strong>
                            </Typography>
                            <Chip
                                size="small"
                                label={formatStatus(status)}
                                color={STATUS_COLOR[status] || "default"}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Veterinario:</strong>{" "}
                            {veterinarianName
                                ? `${veterinarianName} (#${veterinarianId})`
                                : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Dueño:</strong>{" "}
                            {ownerName ? `${ownerName} (#${ownerId})` : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography>
                            <strong>Mascota:</strong> {petName ? `${petName} (#${petId})` : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <strong>Motivo:</strong> {reason || "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography>
                            <strong>Notas:</strong> {notes || "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Delete confirm dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar turno"
                message="¿Confirmás eliminar este turno? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </Stack>
    );
};

export default AppointmentDetail;
