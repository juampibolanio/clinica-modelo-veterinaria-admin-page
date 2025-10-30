// PetEdit.jsx
import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import PetForm from "../components/PetForm";
import { getPetById, patchPet } from "../api/pets.api";
import { petPageStyles } from "../styles/petPage.styles";

const PetEdit = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pet, setPet] = useState(null);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const data = await getPetById(id);
                setPet(data);
            } catch {
                enqueueSnackbar("Error al cargar la mascota", { variant: "error" });
                navigate("/pets");
            } finally {
                setLoading(false);
            }
        };
        fetchPet();
    }, [id, navigate, enqueueSnackbar]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await patchPet(id, formData);
            enqueueSnackbar("Mascota actualizada correctamente ✅", { variant: "success" });
            navigate(`/pets/${id}`);
        } catch {
            enqueueSnackbar("Error al actualizar la mascota", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Box sx={petPageStyles.loadingBox}>
                <CircularProgress />
            </Box>
        );

    if (!pet) return null;

    return (
        <Stack sx={petPageStyles.container}>
            <Typography variant="h4" sx={petPageStyles.title}>
                Editar mascota
            </Typography>
            <PetForm
                onSubmit={handleSubmit}
                submitting={saving}
                mode="edit"
                defaultValues={{
                    ...pet,
                    birthDate: pet.birthDate ? String(pet.birthDate).slice(0, 10) : "",
                }}
            />
        </Stack>
    );
};

export default PetEdit;
