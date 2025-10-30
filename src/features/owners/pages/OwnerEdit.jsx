import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import OwnerForm from "../components/OwnerForm";
import { getOwnerById, patchOwner } from "../api/owners.api";
import { ownerEditStyles } from "../styles/ownerEdit.styles";

/**
 * Page: Edit Owner
 * Loads owner data and allows patching with validation.
 */
const OwnerEdit = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const data = await getOwnerById(id);
                setOwner(data);
            } catch (error) {
                console.error("Error al cargar dueño:", error);
                enqueueSnackbar("Error al cargar el dueño", { variant: "error" });
                navigate("/owners");
            } finally {
                setLoading(false);
            }
        };
        fetchOwner();
    }, [id, enqueueSnackbar, navigate]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // 🔹 Patch only modified fields
            const updates = {};
            for (const key in formData) {
                if (formData[key] !== owner[key]) updates[key] = formData[key];
            }

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchOwner(id, updates);
            enqueueSnackbar("Datos actualizados correctamente ✅", { variant: "success" });
            navigate("/owners");
        } catch (error) {
            console.error("Error al actualizar dueño:", error);
            enqueueSnackbar("Error al actualizar", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Box sx={ownerEditStyles.loadingBox}>
                <CircularProgress />
            </Box>
        );

    return (
        <Stack sx={ownerEditStyles.container}>
            <Typography variant="h4" sx={ownerEditStyles.title}>
                Editar Dueño / Cliente
            </Typography>
            <OwnerForm
                defaultValues={owner}
                onSubmit={handleSubmit}
                submitting={saving}
                mode="edit"
            />
        </Stack>
    );
};

export default OwnerEdit;
