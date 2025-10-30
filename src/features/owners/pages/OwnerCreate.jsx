import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import OwnerForm from "../components/OwnerForm";
import { createOwner } from "../api/owners.api";
import { ownerCreateStyles } from "../styles/ownerCreate.styles";

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
        <Stack sx={ownerCreateStyles.container}>
            <Typography variant="h4" sx={ownerCreateStyles.title}>
                Nuevo Dueño / Cliente
            </Typography>
            <Typography sx={ownerCreateStyles.subtitle}>
                Registra un nuevo cliente en el sistema
            </Typography>
            <OwnerForm onSubmit={handleSubmit} submitting={saving} mode="create" />
        </Stack>
    );
};

export default OwnerCreate;
