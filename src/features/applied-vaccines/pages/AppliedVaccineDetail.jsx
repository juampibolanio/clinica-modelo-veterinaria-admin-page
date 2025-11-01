import { useEffect, useState } from "react";
import {
    Stack,
    Typography,
    Paper,
    Divider,
    Button,
    CircularProgress,
    Box,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import dayjs from "dayjs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import PetsIcon from "@mui/icons-material/PetsRounded";
import FeedIcon from "@mui/icons-material/FeedRounded";
import VaccinesIcon from "@mui/icons-material/VaccinesRounded";
import PersonIcon from "@mui/icons-material/PersonRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
    getAppliedVaccineById,
    deleteAppliedVaccine,
} from "../api/applied-vaccines.api";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

/**
 * AppliedVaccineDetail
 * Displays detailed information about a specific applied vaccine record.
 */
const AppliedVaccineDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // ==============================
    // Fetch data
    // ==============================
    const fetchData = async () => {
        try {
            const data = await getAppliedVaccineById(id);
            setItem(data);
        } catch (err) {
            console.error("Error loading applied vaccine:", err);
            enqueueSnackbar("Error al cargar la vacunación", { variant: "error" });
            navigate("/applied-vaccines");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleDelete = async () => {
        try {
            await deleteAppliedVaccine(id);
            enqueueSnackbar("Vacunación eliminada correctamente ✅", {
                variant: "success",
            });
            navigate(-1);
        } catch (err) {
            console.error("Error deleting applied vaccine:", err);
            enqueueSnackbar("No se pudo eliminar la vacunación", {
                variant: "error",
            });
        } finally {
            setConfirmOpen(false);
        }
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight={300}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!item) return null;

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack
                direction={isMobile ? "column" : "row"}
                alignItems={isMobile ? "stretch" : "center"}
                spacing={isMobile ? 2 : 1.5}
                flexWrap="wrap"
            >
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        fullWidth={isMobile}
                    >
                        Volver
                    </Button>
                </Stack>

                <Typography
                    variant={isMobile ? "h5" : "h4"}
                    fontWeight={800}
                    textAlign={isMobile ? "center" : "left"}
                    sx={{ flexGrow: 1 }}
                >
                    Detalle de vacunación
                </Typography>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={isMobile ? 1 : 1.5}
                    justifyContent="flex-end"
                    alignItems={isMobile ? "stretch" : "center"}
                    sx={{ width: isMobile ? "100%" : "auto" }}
                >
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/applied-vaccines/${id}/edit`)}
                        fullWidth={isMobile}
                    >
                        Editar
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => setConfirmOpen(true)}
                        fullWidth={isMobile}
                    >
                        Eliminar
                    </Button>
                </Stack>
            </Stack>

            {/* Main info card */}
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(55,129,227,0.1)",
                }}
            >
                <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <VaccinesIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>
                            Información general
                        </Typography>
                    </Stack>
                    <Divider />

                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        gap={isMobile ? 2 : 4}
                        sx={{ mt: 1 }}
                    >
                        <Stack spacing={1} sx={{ minWidth: 240 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Fecha
                            </Typography>
                            <Typography variant="body1">
                                {item.date ? dayjs(item.date).format("DD/MM/YYYY") : "—"}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                Producto (vacuna)
                            </Typography>
                            <Typography variant="body1">{item.productName || "—"}</Typography>

                            <Typography variant="subtitle2" color="text.secondary" mt={2}>
                                Veterinario
                            </Typography>
                            <Typography variant="body1">{item.veterinarianName || "—"}</Typography>
                        </Stack>

                        <Stack spacing={1} sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Observaciones
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                    bgcolor: "rgba(55,129,227,0.03)",
                                    p: 1.5,
                                    borderRadius: 1,
                                }}
                            >
                                {item.observations || "—"}
                            </Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Paper>

            {/* Related records */}
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    boxShadow: "0 3px 10px rgba(55,129,227,0.1)",
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <Typography variant="h6" fontWeight={700}>
                        Registros relacionados
                    </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={isMobile ? 1.5 : 2}
                    flexWrap="wrap"
                    justifyContent="flex-start"
                >
                    <Button
                        variant="outlined"
                        startIcon={<PetsIcon />}
                        onClick={() => navigate(`/pets/${item.petId}`)}
                        fullWidth={isMobile}
                    >
                        Ver mascota: {item.petName}
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<FeedIcon />}
                        onClick={() =>
                            navigate(`/clinical-history/${item.clinicalHistoryId}`)
                        }
                        fullWidth={isMobile}
                    >
                        Ver historia clínica
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate(`/security`)}
                        fullWidth={isMobile}
                    >
                        Ver veterinario: {item.veterinarianName}
                    </Button>
                </Stack>
            </Paper>

            {/* Delete confirmation dialog */}
            <ConfirmDialog
                open={confirmOpen}
                title="Eliminar vacunación"
                message="¿Estás seguro de eliminar este registro de vacunación? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleDelete}
            />
        </Stack>
    );
};

export default AppliedVaccineDetail;
