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
    Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { getPetById, getPetsByOwnerId } from "../api/pets.api";
import { getOwnerById } from "../../owners/api/owners.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { SectionList } from "../../pets/components/SectionList";
import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";

/**
 * PetDetail
 * Displays pet information, its owner and recent appointments.
 */
const PetDetail = () => {
    const { id } = useParams(); // pet ID
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pet, setPet] = useState(null);
    const [owner, setOwner] = useState(null);
    const [relatedPets, setRelatedPets] = useState([]);
    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);

    /**
     * Fetch data for the pet, its owner and related info
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                const petData = await getPetById(id);
                setPet(petData);

                const ownerId = petData.owner?.id || petData.ownerId;
                if (!ownerId) {
                    throw new Error("El ID del dueño no está disponible");
                }

                const ownerData = await getOwnerById(ownerId);
                setOwner(ownerData);

                const petsData = await getPetsByOwnerId(ownerId);
                setRelatedPets(petsData || []);

                const appointmentsData = await listAppointments({
                    petId: id,
                    page: 0,
                    size: 5,
                    sortBy: "date",
                    direction: "desc",
                });
                setAppointments(appointmentsData.content || []);
            } catch (error) {
                console.error("Error al cargar datos de la mascota:", error);
                enqueueSnackbar("Error al cargar la información de la mascota", {
                    variant: "error",
                });
                navigate("/pets");
            } finally {
                setLoading(false);
                setLoadingRelated(false);
                setLoadingAppointments(false);
            }
        };

        fetchData();
    }, [id, enqueueSnackbar, navigate]);


    /**
     * Loading state
     */
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) return null;

    return (
        <Stack spacing={3} sx={{ p: { xs: 1, sm: 2 } }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
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

            {/* General Info */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    {[
                        { label: "Nombre", value: pet.name },
                        { label: "Especie", value: pet.species },
                        { label: "Raza", value: pet.breed || "-" },
                        {
                            label: "Género",
                            value:
                                pet.gender === "MALE"
                                    ? "Macho"
                                    : pet.gender === "FEMALE"
                                        ? "Hembra"
                                        : "-",
                        },
                        { label: "Peso (kg)", value: pet.weight ? `${pet.weight} kg` : "-" },
                        {
                            label: "Fecha de nacimiento",
                            value: pet.birthDate
                                ? dayjs(pet.birthDate).format("DD/MM/YYYY")
                                : "-",
                        },
                    ].map((item) => (
                        <Grid key={item.label} item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="body1">{item.value}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Owner Section */}
            {owner && (
                <SectionList
                    icon={<PersonIcon color="primary" />}
                    title="Dueño"
                    items={[owner]}
                    loading={false}
                    emptyText="No se encontró información del dueño."
                    renderItem={(o) => (
                        <>
                            <Typography sx={{ minWidth: 160, fontWeight: 700 }}>
                                {o.name} {o.surname}
                            </Typography>
                            <Typography sx={{ minWidth: 160 }}>{o.email}</Typography>
                            <Typography sx={{ minWidth: 140 }}>{o.phoneNumber}</Typography>
                            <Button
                                size="small"
                                onClick={() => navigate(`/owners/${o.id}`)}
                            >
                                Ver detalle
                            </Button>
                        </>
                    )}
                />
            )}

            {/* Related Pets */}
            <SectionList
                icon={<PetsIcon color="primary" />}
                title="Otras mascotas del dueño"
                items={relatedPets.filter((p) => p.id !== pet.id)}
                loading={loadingRelated}
                emptyText="No hay otras mascotas registradas."
                createLabel="Nueva mascota"
                onCreate={() => navigate(`/pets/create?ownerId=${owner?.id}`)}
                renderItem={(p) => (
                    <>
                        <Typography sx={{ minWidth: 160, fontWeight: 700 }}>
                            {p.name}
                        </Typography>
                        <Typography sx={{ minWidth: 140 }}>
                            {p.species} - {p.breed || "-"}
                        </Typography>
                        <Typography sx={{ minWidth: 100 }}>
                            {p.gender === "MALE"
                                ? "Macho"
                                : p.gender === "FEMALE"
                                    ? "Hembra"
                                    : "-"}
                        </Typography>
                        <Typography flex={1}>
                            {p.weight ? `${p.weight} kg` : "-"}
                        </Typography>
                        <Button size="small" onClick={() => navigate(`/pets/${p.id}`)}>
                            Ver
                        </Button>
                    </>
                )}
            />

            {/* Appointments Section */}
            <SectionList
                icon={<CalendarMonthIcon color="primary" />}
                title="Turnos recientes"
                items={appointments}
                loading={loadingAppointments}
                emptyText="No hay turnos registrados para esta mascota."
                createLabel="Nuevo turno"
                onCreate={() =>
                    navigate(`/appointments/create?ownerId=${owner?.id}&petId=${pet.id}`)
                }
                renderItem={(a) => (
                    <>
                        <Typography sx={{ minWidth: 120 }}>
                            {dayjs(a.date).format("DD/MM/YYYY")} {a.time}
                        </Typography>
                        <Chip
                            label={formatStatus(a.status)}
                            size="small"
                            color={STATUS_COLOR[a.status] || "default"}
                        />
                        <Typography flex={1}>{a.reason || "Sin motivo"}</Typography>
                        <Button
                            size="small"
                            onClick={() => navigate(`/appointments/${a.id}`)}
                        >
                            Ver
                        </Button>
                    </>
                )}
            />
        </Stack>
    );
};

export default PetDetail;
