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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getAppointmentById, deleteAppointment } from "../api/appointments.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import dayjs from "dayjs";
import { formatStatus, STATUS_COLOR } from "../utils/utils";
import { appointmentDetailStyles } from "../styles/appointmentDetail.styles";

const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAppointmentById(id);
                setAppointment(data);
            } catch {
                enqueueSnackbar("Error al cargar el turno", { variant: "error" });
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, enqueueSnackbar, navigate]);

    const handleDelete = async () => {
        try {
            await deleteAppointment(id);
            enqueueSnackbar("Turno eliminado correctamente ✅", { variant: "success" });
            navigate("/appointments");
        } catch {
            enqueueSnackbar("No se pudo eliminar el turno", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={240}>
                <CircularProgress />
            </Box>
        );

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
        <Stack spacing={3} sx={appointmentDetailStyles.container}>
            {/* Header */}
            <Stack sx={appointmentDetailStyles.header}>
                <Typography sx={appointmentDetailStyles.headerTitle}>
                    Detalle del turno
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                    {/* 🔙 Botón volver */}
                    <Button
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                        sx={appointmentDetailStyles.backButton}
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </Button>

                    {/* ✏️ Editar */}
                    <Button
                        variant="outlined"
                        sx={appointmentDetailStyles.editButton}
                        onClick={() =>
                            navigate(`/appointments/${id}/edit`, { state: { appointment } })
                        }
                    >
                        Editar
                    </Button>

                    {/* ❌ Eliminar */}
                    <Button
                        variant="contained"
                        sx={appointmentDetailStyles.deleteButton}
                        onClick={() => setConfirmOpen(true)}
                    >
                        Eliminar
                    </Button>
                </Stack>
            </Stack>

            {/* Appointment Info */}
            <Paper sx={appointmentDetailStyles.paper}>
                <Typography sx={appointmentDetailStyles.sectionTitle}>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Fecha:</strong> {dayjs(date).format("DD/MM/YYYY")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Hora:</strong> {time?.slice(0, 5) || "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
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
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Veterinario:</strong>{" "}
                            {veterinarianName
                                ? `${veterinarianName} (#${veterinarianId})`
                                : "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Dueño:</strong>{" "}
                            {ownerName ? `${ownerName} (#${ownerId})` : "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Mascota:</strong> {petName ? `${petName} (#${petId})` : "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Motivo:</strong> {reason || "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={appointmentDetailStyles.gridItem}>
                        <Typography>
                            <strong>Notas:</strong> {notes || "-"}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

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
