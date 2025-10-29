import { useEffect, useMemo, useState } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
    Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { CONSULTATION_TYPES } from "../constants/consultation-types";
import { COMMON_DIAGNOSES } from "../constants/common-diagnoses";
import { getAllUsers } from "../../users/api/users.api";
import { getProducts } from "../../products/api/products.api";
import { useAuth } from "../../auth/AuthContext";

const empty = {
    consultationType: "",
    consultationReason: "",
    diagnosis: "",
    customDiagnosis: "",
    treatment: "",
    date: dayjs().format("YYYY-MM-DD"),
    observations: "",
    veterinarianId: "",
    petId: "",
    usedProductIds: [], // 🆕 productos usados
};

const ClinicalHistoryForm = ({ initialValues, onSubmit, saving }) => {
    const [form, setForm] = useState(empty);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const { user } = useAuth();

    // 🔹 Cargar veterinarios y productos
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingUsers(true);
                setLoadingProducts(true);

                const [usersRes, productsRes] = await Promise.all([
                    getAllUsers(),
                    getProducts(),
                ]);

                setUsers(usersRes);
                setProducts(productsRes.content || productsRes);
            } finally {
                setLoadingUsers(false);
                setLoadingProducts(false);
            }
        };
        fetchData();
    }, []);

    // 🔹 Setear valores iniciales
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            veterinarianId:
                initialValues?.veterinarianId || user?.id || "",
        }));
    }, [initialValues, user]);

    // 🔹 Validación
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

    // 🆕 Manejar selección múltiple de productos
    const handleProductSelect = (e) => {
        const value = e.target.value;
        setForm((f) => ({
            ...f,
            usedProductIds: typeof value === "string" ? value.split(",") : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            diagnosis:
                form.diagnosis === "Otro"
                    ? form.customDiagnosis
                    : form.diagnosis,
        };
        delete payload.customDiagnosis;
        onSubmit?.(payload);
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

                {/* Diagnóstico */}
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Diagnóstico"
                        name="diagnosis"
                        fullWidth
                        value={form.diagnosis || ""}
                        onChange={handleChange}
                    >
                        {COMMON_DIAGNOSES.map((d) => (
                            <MenuItem key={d} value={d}>
                                {d}
                            </MenuItem>
                        ))}
                        <MenuItem value="Otro">Otro...</MenuItem>
                    </TextField>
                </Grid>

                {/* Diagnóstico personalizado */}
                {form.diagnosis === "Otro" && (
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Especificar diagnóstico"
                            name="customDiagnosis"
                            fullWidth
                            value={form.customDiagnosis || ""}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                )}

                {/* Tratamiento */}
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

                {/* 🆕 Productos utilizados */}
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Productos utilizados"
                        name="usedProductIds"
                        fullWidth
                        SelectProps={{
                            multiple: true,
                            renderValue: (selected) => (
                                <Stack direction="row" flexWrap="wrap" gap={1}>
                                    {selected.map((id) => {
                                        const prod = products.find((p) => p.id === id);
                                        return (
                                            <Chip
                                                key={id}
                                                label={prod ? prod.name : id}
                                                size="small"
                                            />
                                        );
                                    })}
                                </Stack>
                            ),
                        }}
                        value={form.usedProductIds || []}
                        onChange={handleProductSelect}
                        disabled={loadingProducts}
                    >
                        {products.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name} — Stock: {p.stock}
                            </MenuItem>
                        ))}
                    </TextField>
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
                        disabled
                    />
                </Grid>

                {/* Guardar / Cancelar */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!canSubmit || saving}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </Stack>
                </Grid>

            </Grid>
        </form>
    );
};

export default ClinicalHistoryForm;
