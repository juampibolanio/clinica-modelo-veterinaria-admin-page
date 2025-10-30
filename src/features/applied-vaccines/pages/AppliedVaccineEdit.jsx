import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import {
    getAppliedVaccineById,
    patchAppliedVaccine,
} from "../api/applied-vaccines.api";
import AppliedVaccineForm from "../components/AppliedVaccineForm";

/**
 * AppliedVaccineEdit
 * Page for editing an existing applied vaccine.
 */
const AppliedVaccineEdit = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const [vaccine, setVaccine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==============================
    // Fetch data
    // ==============================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAppliedVaccineById(id);
                setVaccine(data);
            } catch (err) {
                console.error("Error loading applied vaccine:", err);
                enqueueSnackbar("Error al cargar la vacuna aplicada", {
                    variant: "error",
                });
                navigate("/applied-vaccines");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // ==============================
    // Handle submit
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // Send only modified fields (PATCH)
            const updates = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== vaccine[key]) updates[key] = formData[key];
            });

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchAppliedVaccine(id, updates);
            enqueueSnackbar("Vacuna actualizada correctamente ✅", {
                variant: "success",
            });
            navigate("/applied-vaccines");
        } catch (err) {
            console.error("Error updating applied vaccine:", err);
            enqueueSnackbar("Error al actualizar la vacuna", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // Loading state
    // ==============================
    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar vacuna aplicada
            </Typography>
            <AppliedVaccineForm
                initialValues={vaccine}
                onSubmit={handleSubmit}
                saving={saving}
                petId={vaccine?.petId}
            />
        </Stack>
    );
};

export default AppliedVaccineEdit;
