import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import OwnerForm from "../components/OwnerForm";
import { getOwnerById, patchOwner } from "../api/owners.api";

const OwnerEdit = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getOwnerById(id);
                setOwner(data);
            } catch {
                enqueueSnackbar("Error al cargar el dueño", { variant: "error" });
                navigate("/owners");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await patchOwner(id, formData);
            enqueueSnackbar("Datos actualizados correctamente", { variant: "success" });
            navigate("/owners");
        } catch {
            enqueueSnackbar("Error al actualizar", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={2} sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" fontWeight={800}>
                Editar Dueño
            </Typography>
            <OwnerForm defaultValues={owner} onSubmit={handleSubmit} submitting={saving} mode="edit" />
        </Stack>
    );
};

export default OwnerEdit;