import React, { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import PetForm from "../components/PetForm";
import { getPetById, patchPet } from "../api/pets.api";

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
    }, [id, navigate]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await patchPet(id, formData);
            enqueueSnackbar("Mascota actualizada correctamente", { variant: "success" });
            navigate(`/pets/${id}`);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al actualizar mascota", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) return null;

    return (
        <Stack spacing={3}>
            <Typography variant="h4" fontWeight={800}>
                Editar mascota
            </Typography>
            <PetForm
                onSubmit={handleSubmit}
                submitting={saving}
                defaultValues={pet}
                mode="edit"
            />
        </Stack>
    );
};

export default PetEdit;
