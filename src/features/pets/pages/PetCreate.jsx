// PetCreate.jsx
import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import PetForm from "../components/PetForm";
import { createPet } from "../api/pets.api";
import { petPageStyles } from "../styles/petPage.styles";

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
            enqueueSnackbar("Mascota registrada correctamente ✅", { variant: "success" });
            formData.ownerId ? navigate(`/owners/${formData.ownerId}`) : navigate("/pets");
        } catch {
            enqueueSnackbar("Error al registrar la mascota", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (ownerId === null) {
        return (
            <Box sx={petPageStyles.loadingBox}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack sx={petPageStyles.container}>
            <Typography variant="h4" sx={petPageStyles.title}>
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
