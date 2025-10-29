import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetForm from "../components/PetForm";
import { createPet } from "../api/pets.api";

/**
 * PetCreate
 * Página para registrar una nueva mascota.
 * Puede venir con ownerId precargado desde la URL (?ownerId=)
 */
const PetCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [saving, setSaving] = useState(false);
    const [ownerId, setOwnerId] = useState(null);

    useEffect(() => {
        const ownerParam = searchParams.get("ownerId");
        setOwnerId(ownerParam ? Number(ownerParam) : 0);
    }, [searchParams]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createPet(formData);
            enqueueSnackbar("Mascota registrada correctamente", { variant: "success" });

            if (formData.ownerId) {
                navigate(`/owners/${formData.ownerId}`);
            } else {
                navigate("/pets");
            }
        } catch {
            enqueueSnackbar("Error al registrar la mascota", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    // Loader mientras se obtiene el parámetro
    if (ownerId === null) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
            <Typography variant="h4" fontWeight={800}>
                Registrar nueva mascota
            </Typography>

            <PetForm
                onSubmit={handleSubmit}
                submitting={saving}
                mode="create"
                defaultValues={{ ownerId }}
            />
        </Stack>
    );
};

export default PetCreate;
