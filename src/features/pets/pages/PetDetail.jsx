import React, { useEffect, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Paper,
    Divider,
    Grid,
    CircularProgress,
    Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/PersonRounded";
import { useNavigate, useParams } from "react-router-dom";
import { getPetById } from "../api/pets.api";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchPetData = async () => {
        try {
            const data = await getPetById(id);
            setPet(data);
        } catch (error) {
            enqueueSnackbar("Error al cargar la información de la mascota", { variant: "error" }, error);
            navigate("/pets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPetData();
    }, [id]);

    const translateGender = (value) => {
        if (value === "MALE") return "Macho";
        if (value === "FEMALE") return "Hembra";
        return "-";
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return "-";
        const now = dayjs();
        const birth = dayjs(birthDate);
        const years = now.diff(birth, "year");

        if (years >= 1) {
            return `${years} ${years === 1 ? "año" : "años"}`;
        }

        const months = now.diff(birth, "month");
        if (months >= 1) {
            return `${months} ${months === 1 ? "mes" : "meses"}`;
        }

        const days = now.diff(birth, "day");
        return `${days} ${days === 1 ? "día" : "días"}`;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) return null;

    return (
        <Stack spacing={3}>
            {/* Header */}
            <Stack direction="row" alignItems="center" flexWrap="wrap" spacing={1}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/pets")}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Detalle de la mascota
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/pets/${id}/edit`)}
                    sx={{ ml: "auto" }}
                >
                    Editar
                </Button>
            </Stack>

            {/* Datos generales */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Nombre
                        </Typography>
                        <Typography variant="body1">{pet.name}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Especie
                        </Typography>
                        <Typography variant="body1">{pet.species}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Raza
                        </Typography>
                        <Typography variant="body1">{pet.breed || "-"}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Género
                        </Typography>
                        <Typography variant="body1">{translateGender(pet.gender)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Color
                        </Typography>
                        <Typography variant="body1">{pet.color || "-"}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Peso
                        </Typography>
                        <Typography variant="body1">{pet.weight} kg</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Fecha de nacimiento
                        </Typography>
                        <Typography variant="body1">
                            {pet.birthDate ? dayjs(pet.birthDate).format("DD/MM/YYYY") : "-"}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Edad
                        </Typography>
                        <Typography variant="body1">{calculateAge(pet.birthDate)}</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Alergias
                        </Typography>
                        <Typography variant="body1">{pet.allergies || "Ninguna"}</Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* Dueño */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Dueño
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body1">
                        ID del dueño:{" "}
                        <Typography component="span" fontWeight={700}>
                            #{pet.ownerId}
                        </Typography>
                    </Typography>

                    <Button
                        variant="outlined"
                        startIcon={<PersonIcon />}
                        onClick={() => navigate(`/owners/${pet.ownerId}`)}
                    >
                        Ver información del dueño
                    </Button>
                </Stack>
            </Paper>
        </Stack>
    );
};

export default PetDetail;
