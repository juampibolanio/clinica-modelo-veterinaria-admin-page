import { useEffect, useState } from "react";
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
    Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PetsIcon from "@mui/icons-material/Pets";
import PersonIcon from "@mui/icons-material/PersonRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import VaccinesIcon from "@mui/icons-material/VaccinesRounded";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

import { getPetById, getPetsByOwnerId } from "../api/pets.api";
import { getOwnerById } from "../../owners/api/owners.api";
import { listAppointments } from "../../appointments/api/appointments.api";
import { listClinicalHistory } from "../../clinical-history/api/clinical-history.api";
import { listAppliedVaccines } from "../../applied-vaccines/api/applied-vaccines.api";

import { SectionList } from "../components/SectionList";
import { STATUS_COLOR, formatStatus } from "../../appointments/utils/utils";
import { petDetailStyles } from "../styles/petDetail.styles";

const PetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [pet, setPet] = useState(null);
    const [owner, setOwner] = useState(null);
    const [relatedPets, setRelatedPets] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [clinicalHistories, setClinicalHistories] = useState([]);
    const [appliedVaccines, setAppliedVaccines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingRelated, setLoadingRelated] = useState(true);
    const [loadingAppointments, setLoadingAppointments] = useState(true);
    const [loadingClinicalHistories, setLoadingClinicalHistories] = useState(true);
    const [loadingVaccines, setLoadingVaccines] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const petData = await getPetById(id);
                setPet(petData);

                const ownerId = petData.owner?.id || petData.ownerId;
                if (!ownerId) throw new Error("El ID del dueño no está disponible");

                const [ownerData, petsData, appointmentsData, historiesData, vaccinesData] =
                    await Promise.all([
                        getOwnerById(ownerId),
                        getPetsByOwnerId(ownerId),
                        listAppointments({
                            petId: id,
                            page: 0,
                            size: 5,
                            sortBy: "date",
                            direction: "desc",
                        }),
                        listClinicalHistory({
                            petId: id,
                            page: 0,
                            size: 5,
                            sortBy: "date",
                            direction: "desc",
                        }),
                        listAppliedVaccines({
                            petId: id,
                            page: 0,
                            size: 5,
                            sortBy: "date",
                            direction: "desc",
                        }),
                    ]);

                setOwner(ownerData);
                setRelatedPets(petsData || []);
                setAppointments(appointmentsData.content || []);
                setClinicalHistories(historiesData.content || []);
                setAppliedVaccines(vaccinesData.content || []);
            } catch (error) {
                console.error("Error al cargar datos:", error);
                enqueueSnackbar("Error al cargar la información de la mascota", { variant: "error" });
                navigate("/pets");
            } finally {
                setLoading(false);
                setLoadingRelated(false);
                setLoadingAppointments(false);
                setLoadingClinicalHistories(false);
                setLoadingVaccines(false);
            }
        };

        fetchData();
    }, [id, enqueueSnackbar, navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pet) return null;

    return (
        <Stack spacing={4} sx={petDetailStyles.container}>
            {/* === HEADER === */}
            <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" spacing={2}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate("/pets")}
                    sx={petDetailStyles.backButton}
                >
                    Volver
                </Button>

                <Typography variant="h4" sx={petDetailStyles.title}>
                    Detalle de la mascota
                </Typography>

                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/pets/${id}/edit`)}
                    sx={petDetailStyles.editButton}
                >
                    Editar
                </Button>
            </Stack>

            {/* === INFORMACIÓN GENERAL === */}
            <Paper elevation={0} sx={petDetailStyles.infoCard}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Información general
                </Typography>
                <Divider sx={petDetailStyles.divider} />

                <Grid container spacing={2}>
                    {[
                        { label: "Nombre", value: pet.name },
                        { label: "Especie", value: pet.species },
                        { label: "Raza", value: pet.breed || "-" },
                        {
                            label: "Sexo",
                            value:
                                pet.gender === "MALE"
                                    ? "Macho"
                                    : pet.gender === "FEMALE"
                                        ? "Hembra"
                                        : "-",
                        },
                        { label: "Peso", value: pet.weight ? `${pet.weight} kg` : "-" },
                        {
                            label: "Fecha de nacimiento",
                            value: pet.birthDate
                                ? dayjs(pet.birthDate).format("DD/MM/YYYY")
                                : "-",
                        },
                        { label: "Color", value: pet.color || "-" },
                        { label: "Alergias", value: pet.allergies || "-" },
                    ].map((item) => (
                        <Grid key={item.label} item xs={12} sm={6} md={4}>
                            <Typography variant="subtitle2" color="text.secondary">
                                {item.label}
                            </Typography>
                            <Typography variant="body1" fontWeight={500}>
                                {item.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* === DUEÑO === */}
            {owner && (
                <SectionList
                    icon={<PersonIcon color="primary" />}
                    title="Dueño de la mascota"
                    items={[owner]}
                    emptyText="No se encontró información del dueño."
                    renderItem={(o) => (
                        <>
                            <Typography sx={{ minWidth: 160, fontWeight: 700 }}>
                                {o.name} {o.surname}
                            </Typography>
                            <Typography sx={{ minWidth: 180 }}>{o.email || "Sin correo"}</Typography>
                            <Typography sx={{ minWidth: 140 }}>{o.phoneNumber || "Sin teléfono"}</Typography>
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={() => navigate(`/owners/${o.id}`)}
                                sx={petDetailStyles.smallButton}
                            >
                                Ver detalle
                            </Button>
                        </>
                    )}
                />
            )}

            {/* === OTRAS MASCOTAS === */}
            <SectionList
                icon={<PetsIcon color="primary" />}
                title="Otras mascotas del dueño"
                items={relatedPets.filter((p) => p.id !== pet.id)}
                loading={loadingRelated}
                emptyText="No hay otras mascotas registradas."
                createLabel="Registrar nueva"
                onCreate={() => navigate(`/pets/create?ownerId=${owner?.id}`)}
                renderItem={(p) => (
                    <>
                        <Typography sx={{ minWidth: 160, fontWeight: 700 }}>{p.name}</Typography>
                        <Typography sx={{ minWidth: 160 }}>
                            {p.species} — {p.breed || "-"}
                        </Typography>
                        <Typography sx={{ minWidth: 100 }}>
                            {p.gender === "MALE" ? "Macho" : p.gender === "FEMALE" ? "Hembra" : "-"}
                        </Typography>
                        <Typography flex={1}>{p.weight ? `${p.weight} kg` : "-"}</Typography>
                        <Tooltip title="Ver mascota">
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/pets/${p.id}`)}
                                sx={petDetailStyles.smallButton}
                            >
                                Ver
                            </Button>
                        </Tooltip>
                    </>
                )}
            />

            {/* === HISTORIAS CLÍNICAS === */}
            <SectionList
                icon={<MedicalInformationIcon color="primary" />}
                title="Historias clínicas"
                items={clinicalHistories}
                loading={loadingClinicalHistories}
                emptyText="No hay historias clínicas registradas para esta mascota."
                createLabel="Nueva historia clínica"
                onCreate={() => navigate(`/clinical-history/create?petId=${pet.id}`)}
                renderItem={(h) => (
                    <>
                        <Typography sx={{ minWidth: 140 }}>
                            {dayjs(h.date).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography sx={{ minWidth: 180, fontWeight: 600 }}>
                            {h.consultationType}
                        </Typography>
                        <Typography flex={1}>{h.diagnosis || "Sin diagnóstico"}</Typography>
                        <Typography sx={{ minWidth: 160 }}>
                            {h.veterinarianName || "Veterinario no especificado"}
                        </Typography>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/clinical-history/${h.id}`)}
                            sx={petDetailStyles.smallButton}
                        >
                            Ver
                        </Button>
                    </>
                )}
            />

            {/* === VACUNAS APLICADAS === */}
            <SectionList
                icon={<VaccinesIcon color="primary" />}
                title="Vacunas aplicadas"
                items={appliedVaccines}
                loading={loadingVaccines}
                emptyText="No hay vacunas registradas para esta mascota."
                createLabel="Nueva vacuna aplicada"
                onCreate={() => navigate(`/applied-vaccines/create?petId=${pet.id}`)}
                renderItem={(v) => (
                    <>
                        <Typography sx={{ minWidth: 140 }}>
                            {dayjs(v.date).format("DD/MM/YYYY")}
                        </Typography>
                        <Typography sx={{ minWidth: 200, fontWeight: 600 }}>
                            {v.productName || "Vacuna desconocida"}
                        </Typography>
                        <Typography sx={{ minWidth: 160 }}>
                            {v.veterinarianName || "Veterinario no especificado"}
                        </Typography>
                        <Typography flex={1}>{v.observations || "Sin observaciones"}</Typography>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/applied-vaccines/${v.id}`)}
                            sx={petDetailStyles.smallButton}
                        >
                            Ver
                        </Button>
                    </>
                )}
            />

            {/* === TURNOS === */}
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
                        <Typography sx={{ minWidth: 140 }}>
                            {dayjs(a.date).format("DD/MM/YYYY")}
                        </Typography>
                        <Chip
                            label={formatStatus(a.status)}
                            size="small"
                            color={STATUS_COLOR[a.status] || "default"}
                        />
                        <Typography flex={1}>{a.reason || "Sin motivo"}</Typography>
                        <Button
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/appointments/${a.id}`)}
                            sx={petDetailStyles.smallButton}
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
