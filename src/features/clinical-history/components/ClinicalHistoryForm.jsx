import { useEffect, useMemo, useState } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { CONSULTATION_TYPES } from "../constants/consultation-types";
import { getAllUsers } from "../../users/api/users.api";
import { useAuth } from "../../auth/AuthContext"; // tu contexto de autenticación

const empty = {
    consultationType: "",
    consultationReason: "",
    diagnosis: "",
    treatment: "",
    date: dayjs().format("YYYY-MM-DD"),
    observations: "",
    veterinarianId: "",
    petId: "",
};

const ClinicalHistoryForm = ({ initialValues, onSubmit, saving }) => {
    const [form, setForm] = useState(empty);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const { user } = useAuth(); // usuario logueado

    // 🔹 Traer todos los usuarios (veterinarios)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoadingUsers(true);
                const data = await getAllUsers();
                setUsers(data);
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    // 🔹 Inicializar formulario
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            veterinarianId:
                initialValues?.veterinarianId ||
                user?.id || // si viene logueado, se autocompleta
                "",
        }));
    }, [initialValues, user]);

    const canSubmit = useMemo(() => {
        return (
            form.consultationType &&
            form.consultationReason &&
            form.date &&
            form.veterinarianId &&
            form.petId
        );
    }, [form]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Tipo de consulta */}
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        label="Tipo de consulta"
                        name="consultationType"
                        fullWidth
                        value={form.consultationType || ""}
                        onChange={handleChange}
                        required
                    >
                        {CONSULTATION_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>
                                {t}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Motivo */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Motivo de consulta"
                        name="consultationReason"
                        fullWidth
                        value={form.consultationReason || ""}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Fecha */}
                <Grid item xs={12} md={4}>
                    <TextField
                        type="date"
                        label="Fecha"
                        name="date"
                        fullWidth
                        value={form.date || ""}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>

                {/* Diagnóstico y tratamiento */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Diagnóstico"
                        name="diagnosis"
                        fullWidth
                        value={form.diagnosis || ""}
                        onChange={handleChange}
                        multiline
                        minRows={2}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Tratamiento"
                        name="treatment"
                        fullWidth
                        value={form.treatment || ""}
                        onChange={handleChange}
                        multiline
                        minRows={2}
                    />
                </Grid>

                {/* Observaciones */}
                <Grid item xs={12}>
                    <TextField
                        label="Observaciones"
                        name="observations"
                        fullWidth
                        value={form.observations || ""}
                        onChange={handleChange}
                        multiline
                        minRows={2}
                    />
                </Grid>

                {/* Veterinario */}
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Veterinario"
                        name="veterinarianId"
                        fullWidth
                        value={form.veterinarianId || ""}
                        onChange={handleChange}
                        required
                        disabled={loadingUsers}
                    >
                        {loadingUsers ? (
                            <MenuItem disabled>
                                <CircularProgress size={18} sx={{ mr: 1 }} /> Cargando...
                            </MenuItem>
                        ) : (
                            users.map((u) => (
                                <MenuItem key={u.id} value={u.id}>
                                    {u.name} {u.surname} ({u.role})
                                </MenuItem>
                            ))
                        )}
                    </TextField>
                </Grid>

                {/* Mascota */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="ID Mascota"
                        name="petId"
                        type="number"
                        fullWidth
                        value={form.petId || ""}
                        onChange={handleChange}
                        required
                        disabled={true}
                    />
                </Grid>

                {/* Botón guardar */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button type="submit" variant="contained" disabled={!canSubmit || saving}>
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default ClinicalHistoryForm;
