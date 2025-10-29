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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getAppointmentById, deleteAppointment } from "../api/appointments.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import dayjs from "dayjs";
import { formatStatus, STATUS_COLOR } from "../utils/utils"; // ✅ import actualizado

const AppointmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAppointmentById(id);
                setItem(data);
            } catch {
                enqueueSnackbar("Error al cargar el turno", { variant: "error" });
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteAppointment(id);
            enqueueSnackbar("Turno eliminado", { variant: "success" });
            navigate("/appointments");
        } catch {
            enqueueSnackbar("No se pudo eliminar", { variant: "error" });
        } finally {
            setConfirmOpen(false);
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );

    if (!item) return null;

    return (
        <Stack spacing={2}>
            {/* Header */}
            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
                <Typography variant="h4" fontWeight={800}>
                    Detalle del turno
                </Typography>
                <Box sx={{ ml: "auto" }}>
                    <Button
                        sx={{ mr: 1 }}
                        variant="outlined"
                        onClick={() => navigate(`/appointments/${id}/edit`)}
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
                </Box>
            </Stack>

            {/* Información del turno */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack spacing={1}>
                    <Typography>
                        <b>Fecha:</b> {item.date ? dayjs(item.date).format("DD/MM/YYYY") : "-"}
                    </Typography>
                    <Typography>
                        <b>Hora:</b> {item.time?.slice(0, 5) || "-"}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>
                            <b>Estado:</b>
                        </Typography>
                        <Chip
                            label={formatStatus(item.status)}
                            color={STATUS_COLOR[item.status] || "default"}
                            size="small"
                        />
                    </Stack>
                    <Typography>
                        <b>Veterinario:</b> {item.veterinarianName} (#{item.veterinarianId})
                    </Typography>
                    <Typography>
                        <b>Dueño:</b> {item.ownerName} (#{item.ownerId})
                    </Typography>
                    <Typography>
                        <b>Mascota:</b> {item.petName} (#{item.petId})
                    </Typography>
                    <Typography>
                        <b>Motivo:</b> {item.reason || "-"}
                    </Typography>
                    <Typography>
                        <b>Notas:</b> {item.notes || "-"}
                    </Typography>
                </Stack>
            </Paper>

            {/* Confirmación de eliminación */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar turno"
                message="¿Confirmás eliminar este turno?"
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </Stack>
    );
};

export default AppointmentDetail;
