import { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    CircularProgress,
    Button,
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { getClinicalHistoryById } from "../api/clinical-history.api";
import { clinicalHistoryDetail as styles } from "../styles/clinicalHistoryDetail.styles";

/**
 * ClinicalHistoryDetail — Detailed, styled view of a clinical history record.
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
    // Loading / Empty states
    // ==============================
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
                <CircularProgress />
            </Box>
        );

    if (!item) return null;

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={3}>
            {/* === Header === */}
            <Stack
                direction={styles.header.direction}
                alignItems={styles.header.alignItems}
                spacing={styles.header.spacing}
                justifyContent={styles.header.justifyContent}
                sx={{ mb: styles.header.mb }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/clinical-history")}
                    sx={styles.backButton}
                >
                    Volver
                </Button>

                <Typography variant="h4" sx={styles.title}>
                    Historia clínica #{item.id}
                </Typography>

                <Button
                    startIcon={<EditIcon />}
                    variant="contained"
                    sx={styles.editButton}
                    onClick={() => navigate(`/clinical-history/${id}/edit`)}
                >
                    Editar
                </Button>
            </Stack>

            {/* === Información general === */}
            <Paper sx={styles.sectionCard}>
                <Typography variant="h6" sx={styles.sectionTitle}>
                    Información general
                </Typography>
                <Divider sx={styles.divider} />

                <GridSection label="Fecha" value={item.date ? dayjs(item.date).format("DD/MM/YYYY") : "-"} />
                <GridSection label="Tipo de consulta" value={item.consultationType || "-"} />
                <GridSection label="Motivo de consulta" value={item.consultationReason || "-"} />
                <GridSection label="Diagnóstico" value={item.diagnosis || "-"} />
                <GridSection label="Tratamiento" value={item.treatment || "-"} />
                <GridSection label="Observaciones" value={item.observations || "-"} />
            </Paper>

            {/* === Relación con entidades === */}
            <Paper sx={styles.sectionCard}>
                <Typography variant="h6" sx={styles.sectionTitle}>
                    Veterinario y mascota asignada
                </Typography>
                <Divider sx={styles.divider} />

                <GridSection
                    label="Mascota"
                    value={`#${item.petId} — ${item.petName || "Desconocida"}`}
                    action={
                        <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/pets/${item.petId}`)}
                            sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                fontWeight: 600,
                            }}
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

            {/* === Productos utilizados === */}
            {item.usedProducts && item.usedProducts.length > 0 && (
                <Paper sx={styles.sectionCard}>
                    <Typography variant="h6" sx={styles.sectionTitle}>
                        Productos utilizados
                    </Typography>
                    <Divider sx={styles.divider} />
                    <Stack direction="row" flexWrap="wrap" gap={1.2}>
                        {item.usedProducts.map((prod) => (
                            <Chip
                                key={prod.id}
                                label={`${prod.name} (Stock: ${prod.stock ?? "N/A"})`}
                                sx={styles.productChip}
                            />
                        ))}
                    </Stack>
                </Paper>
            )}
        </Stack>
    );
};

// ==============================
// Subcomponentes reutilizables
// ==============================
const GridSection = ({ label, value, action }) => (
    <Box sx={styles.gridRow}>
        <Typography variant="subtitle2" sx={styles.gridLabel}>
            {label}
        </Typography>
        <Typography variant="body1" sx={styles.gridValue}>
            {value}
        </Typography>
        {action && <Box sx={styles.gridAction}>{action}</Box>}
    </Box>
);

export default ClinicalHistoryDetail;
