import {
    TextField,
    Stack,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getOwners } from "../../owners/api/owners.api";
import { getAllUsers } from "../../users/api/users.api";
import { getPetsByOwnerId, getPetById } from "../../pets/api/pets.api";
import { useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
    { label: "Pendiente", value: "PENDING" },
    { label: "Confirmado", value: "CONFIRMED" },
    { label: "Cancelado", value: "CANCELLED" },
    { label: "Completado", value: "COMPLETED" },
];

const AppointmentForm = ({ initialValues = {}, onSubmit, saving }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        date: "",
        time: "",
        status: "PENDING",
        veterinarianId: "",
        ownerId: "",
        petId: "",
        reason: "",
        notes: "",
        ...initialValues,
    });

    const [owners, setOwners] = useState([]);
    const [vets, setVets] = useState([]);
    const [pets, setPets] = useState([]);
    const [loadingPetPreset, setLoadingPetPreset] = useState(false);

    // 🔹 Detectar si viene un petId precargado
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const petId = params.get("petId");
        if (petId) {
            setLoadingPetPreset(true);
            (async () => {
                try {
                    const pet = await getPetById(petId);
                    setForm((prev) => ({
                        ...prev,
                        petId: pet.id,
                        ownerId: pet.ownerId,
                    }));
                    const petList = await getPetsByOwnerId(pet.ownerId);
                    setPets(petList);
                } finally {
                    setLoadingPetPreset(false);
                }
            })();
        }
    }, []);

    useEffect(() => {
        (async () => {
            const [ownersData, vetsData] = await Promise.all([
                getOwners(),
                getAllUsers(),
            ]);
            setOwners(ownersData?.content || ownersData);
            setVets(vetsData?.content || vetsData);
        })();
    }, []);

    useEffect(() => {
        if (form.ownerId) {
            (async () => {
                const data = await getPetsByOwnerId(form.ownerId);
                setPets(data);
            })();
        }
    }, [form.ownerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (loadingPetPreset)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} direction="row" flexWrap="wrap" useFlexGap>
                <TextField
                    label="Fecha"
                    type="date"
                    name="date"
                    value={form.date || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
                    required
                />

                <TextField
                    label="Hora"
                    type="time"
                    name="time"
                    value={form.time || ""}
                    onChange={handleChange}
                    required
                    inputProps={{
                        step: 300,
                        min: "09:00",
                        max: "20:00",
                    }}
                />

                <TextField
                    select
                    label="Estado"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    sx={{ minWidth: 180 }}
                >
                    {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>
                            {s.label}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Veterinario"
                    name="veterinarianId"
                    value={form.veterinarianId}
                    onChange={handleChange}
                    sx={{ minWidth: 250 }}
                    required
                >
                    {vets.map((v) => (
                        <MenuItem key={v.id} value={v.id}>
                            {v.name} {v.surname} ({v.role})
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Dueño"
                    name="ownerId"
                    value={form.ownerId}
                    onChange={handleChange}
                    sx={{ minWidth: 200 }}
                    required
                    disabled={!!initialValues.ownerId}
                >
                    {owners.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                            {o.name} {o.surname}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Mascota"
                    name="petId"
                    value={form.petId}
                    onChange={handleChange}
                    sx={{ minWidth: 180 }}
                    required
                    disabled={!form.ownerId || !!initialValues.petId}
                >
                    {pets.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.name}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Motivo"
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    sx={{ minWidth: 300 }}
                />

                <TextField
                    label="Notas"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={3}
                />

                {/* ✅ Botones Guardar / Cancelar */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2, width: "100%" }}>
                    <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={24} /> : "Guardar"}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default AppointmentForm;
