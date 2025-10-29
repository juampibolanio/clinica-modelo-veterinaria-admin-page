import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import OwnerForm from "../components/OwnerForm";
import { createOwner } from "../api/owners.api";

/**
 * Page: Create Owner
 * Renders the form to register a new owner/client.
 */
const OwnerCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createOwner(formData);
            enqueueSnackbar("Dueño creado correctamente ✅", { variant: "success" });
            navigate("/owners");
        } catch (error) {
            console.error("Error al crear dueño:", error);
            enqueueSnackbar("Error al crear el dueño", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" fontWeight={800}>
                Nuevo Dueño
            </Typography>
            <OwnerForm onSubmit={handleSubmit} submitting={saving} mode="create" />
        </Stack>
    );
};

export default OwnerCreate;
