import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import ClinicalHistoryForm from "../components/ClinicalHistoryForm";
import {
    getClinicalHistoryById,
    patchClinicalHistory,
} from "../api/clinical-history.api";

/**
 * ClinicalHistoryEdit
 * Allows editing an existing clinical history (PATCH only modified fields).
 */
const ClinicalHistoryEdit = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [item, setItem] = useState(null);

    // ==============================
    // Fetch data
    // ==============================
    useEffect(() => {
        (async () => {
            try {
                const data = await getClinicalHistoryById(id);
                setItem(data);
            } catch {
                enqueueSnackbar("Error al cargar la historia", { variant: "error" });
                navigate("/clinical-history");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, navigate, enqueueSnackbar]);

    // ==============================
    // Handle update
    // ==============================
    const handleSubmit = async (form) => {
        try {
            setSaving(true);

            // Only send modified fields
            const updates = {};
            Object.keys(form).forEach((k) => {
                if (form[k] !== item[k]) updates[k] = form[k];
            });

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchClinicalHistory(id, updates);
            enqueueSnackbar("Historia actualizada", { variant: "success" });
            navigate(`/clinical-history/${id}`);
        } catch {
            enqueueSnackbar("No se pudo actualizar", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // UI
    // ==============================
    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
                <CircularProgress />
            </Box>
        );

    if (!item) return null;

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar historia clínica
            </Typography>

            <ClinicalHistoryForm
                initialValues={item}
                onSubmit={handleSubmit}
                saving={saving}
            />
        </Stack>
    );
};

export default ClinicalHistoryEdit;
