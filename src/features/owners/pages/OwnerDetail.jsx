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
    IconButton,
    Tooltip,
    TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useParams } from "react-router-dom";
import { getOwnerById, patchOwner } from "../api/owners.api";
import { getPetsByOwnerId } from "../../pets/api/pets.api";
import { useSnackbar } from "notistack";

const OwnerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [owner, setOwner] = useState(null);
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDebt, setEditingDebt] = useState(false);
    const [newDebt, setNewDebt] = useState("");

    const fetchOwnerData = async () => {
        try {
            const ownerData = await getOwnerById(id);
            setOwner(ownerData);
            const petData = await getPetsByOwnerId(id);
            setPets(petData);
        } catch {
            enqueueSnackbar("Error al cargar la información del dueño", {
                variant: "error",
            });
            navigate("/owners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOwnerData();
    }, [id]);

    const handleDebtSave = async () => {
        try {
            const parsedDebt = parseFloat(newDebt);
            if (isNaN(parsedDebt) || parsedDebt < 0) {
                enqueueSnackbar("La deuda debe ser un número válido y no negativo", {
                    variant: "warning",
                });
                return;
            }

            await patchOwner(id, { totalDebt: parsedDebt });
            enqueueSnackbar("Deuda actualizada correctamente", { variant: "success" });
            setOwner((prev) => ({ ...prev, totalDebt: parsedDebt }));
            setEditingDebt(false);
        } catch {
            enqueueSnackbar("Error al actualizar la deuda", { variant: "error" });
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!owner) return null;

    return (
        <Stack spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1}
                flexWrap="wrap"
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/owners")}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                    Volver
                </Button>

                <Typography variant="h4" fontWeight={800}>
                    Detalle del cliente
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/owners/${id}/edit`)}
                    sx={{ ml: { sm: "auto" }, width: { xs: "100%", sm: "auto" } }}
                >
                    Editar
                </Button>
            </Stack>

            {/* Datos generales */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información personal
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    {[
                        ["Nombre", owner.name],
                        ["Apellido", owner.surname],
                        ["Documento", owner.documentNumber || "-"],
                        ["Email", owner.email || "-"],
                        ["Teléfono", owner.phoneNumber || "-"],
                        ["Dirección", owner.address || "-"],
                    ].map(([label, value]) => (
                        <Grid item xs={12} sm={6} md={4} key={label}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {label}
                            </Typography>
                            <Typography variant="body1">{value}</Typography>
                        </Grid>
                    ))}

                    {/* 💰 Deuda total */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="text.secondary">
                            Deuda total
                        </Typography>

                        {editingDebt ? (
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                flexWrap="wrap"
                            >
                                <TextField
                                    size="small"
                                    type="number"
                                    value={newDebt}
                                    onChange={(e) => setNewDebt(e.target.value)}
                                    inputProps={{ min: 0, step: "0.01" }}
                                    sx={{ width: { xs: "100%", sm: 120 } }}
                                />
                                <Stack direction="row" spacing={0.5}>
                                    <IconButton color="success" onClick={handleDebtSave}>
                                        <CheckIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setEditingDebt(false);
                                            setNewDebt("");
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>
                            </Stack>
                        ) : (
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                                flexWrap="wrap"
                            >
                                <Typography
                                    variant="body1"
                                    color={owner.totalDebt > 0 ? "error.main" : "success.main"}
                                >
                                    ${owner.totalDebt?.toFixed(2) || "0.00"}
                                </Typography>
                                <Tooltip title="Editar deuda">
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            setEditingDebt(true);
                                            setNewDebt(owner.totalDebt?.toFixed(2) || "0.00");
                                        }}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* Sección de Mascotas */}
            <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ xs: "stretch", sm: "center" }}
                    justifyContent="space-between"
                    mb={2}
                    spacing={1}
                >
                    <Typography variant="h6" fontWeight={700}>
                        Mascotas registradas
                    </Typography>

                    <Button
                        variant="contained"
                        startIcon={<PetsIcon />}
                        onClick={() => navigate(`/pets/create?ownerId=${id}`)}
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                        Nueva mascota
                    </Button>
                </Stack>

                {pets.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        Este cliente aún no tiene mascotas registradas.
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {pets.map((pet) => (
                            <Grid item xs={12} sm={6} md={4} key={pet.id}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 1,
                                        height: "100%",
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={700}>
                                        {pet.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {pet.species} - {pet.breed || "Sin raza"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Peso: {pet.weight} kg • Edad: {pet.age || "-"} años
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        mt="auto"
                                        justifyContent="flex-start"
                                    >
                                        <Tooltip title="Ver detalle">
                                            <IconButton
                                                color="primary"
                                                onClick={() => navigate(`/pets/${pet.id}`)}
                                                size="small"
                                            >
                                                <PersonIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>
        </Stack>
    );
};

export default OwnerDetail;