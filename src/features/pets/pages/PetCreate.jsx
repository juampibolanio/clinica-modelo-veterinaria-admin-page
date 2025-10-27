import React, { useState, useEffect } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetForm from "../components/PetForm";
import { createPet } from "../api/pets.api";

const PetCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [saving, setSaving] = useState(false);
    const [ownerId, setOwnerId] = useState(null);

    useEffect(() => {
        const ownerParam = searchParams.get("ownerId");
        if (ownerParam) setOwnerId(Number(ownerParam));
    }, [searchParams]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createPet(formData);
            enqueueSnackbar("Mascota registrada correctamente", { variant: "success" });
            if (ownerId) navigate(`/owners/${ownerId}`);
            else navigate("/pets");
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al registrar mascota", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (ownerId === null) {
        // mientras se obtiene el parámetro de la URL
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
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
