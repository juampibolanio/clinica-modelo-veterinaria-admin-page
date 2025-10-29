import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    CircularProgress,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { getClinicalHistoryById } from "../api/clinical-history.api";

/**
 * ClinicalHistoryDetail
 * Displays detailed information for a single clinical history record.
 */
const ClinicalHistoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==============================
    // Fetch data
    // ==============================
    useEffect(() => {
        (async () => {
            try {
                const data = await getClinicalHistoryById(id);
                setItem(data);
            } catch (err) {
                console.error("Error fetching clinical history:", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // ==============================
    // UI states
    // ==============================
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
                <CircularProgress />
            </Box>
        );

    if (!item) return null;

    // ==============================
    // UI render
    // ==============================
    return (
        <Stack spacing={3}>
            {/* === Header === */}
            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/clinical-history")}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Historia clínica #{item.id}
                </Typography>

                <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    color="primary"
                    sx={{ ml: "auto" }}
                    onClick={() => navigate(`/clinical-history/${id}/edit`)}
                >
                    Editar
                </Button>
            </Stack>

            {/* === General Information === */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <GridSection label="Fecha" value={item.date ? dayjs(item.date).format("DD/MM/YYYY") : "-"} />
                <GridSection label="Tipo de consulta" value={item.consultationType || "-"} />
                <GridSection label="Motivo" value={item.consultationReason || "-"} />
                <GridSection label="Diagnóstico" value={item.diagnosis || "-"} />
                <GridSection label="Tratamiento" value={item.treatment || "-"} />
                <GridSection label="Observaciones" value={item.observations || "-"} />
            </Paper>

            {/* === Related Entities === */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Relación con entidades
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <GridSection
                    label="Mascota"
                    value={`#${item.petId} — ${item.petName || "Desconocida"}`}
                    action={
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/pets/${item.petId}`)}
                        >
                            Ver mascota
                        </Button>
                    }
                />
                <GridSection
                    label="Veterinario"
                    value={`#${item.veterinarianId} — ${item.veterinarianName || "Desconocido"}`}
                />
            </Paper>

            {/* === Used Products === */}
            {item.usedProducts && item.usedProducts.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                        Productos utilizados
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    {item.usedProducts.map((prod) => (
                        <Box key={prod.id} sx={{ py: 0.5 }}>
                            <Typography>
                                • <b>{prod.name}</b> — Stock restante: {prod.stock ?? "N/A"}
                            </Typography>
                        </Box>
                    ))}
                </Paper>
            )}
        </Stack>
    );
};

/**
 * GridSection
 * Small reusable component for displaying label-value pairs with optional action button.
 */
const GridSection = ({ label, value, action }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 0.5,
            flexWrap: "wrap",
        }}
    >
        <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 180 }}>
            {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
            {value}
        </Typography>
        {action && <Box sx={{ ml: 2 }}>{action}</Box>}
    </Box>
);

export default ClinicalHistoryDetail;
