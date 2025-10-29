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
import { useAuth } from "../../auth/hooks/useAuth";

/**
 * Default form structure
 */
const emptyForm = {
    consultationType: "",
    consultationReason: "",
    diagnosis: "",
    customDiagnosis: "",
    treatment: "",
    date: dayjs().format("YYYY-MM-DD"),
    observations: "",
    veterinarianId: "",
    petId: "",
    usedProductIds: [],
};

/**
 * ClinicalHistoryForm
 * Manages creation and edition of clinical histories with validation and product linking.
 */
const ClinicalHistoryForm = ({ initialValues, onSubmit, saving }) => {
    const [form, setForm] = useState(emptyForm);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { user } = useAuth();

    // ==============================
    // Load veterinarians and products
    // ==============================
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingUsers(true);
                setLoadingProducts(true);

                const [usersRes, productsRes] = await Promise.all([
                    getAllUsers(),
                    getProducts(),
                ]);

                setUsers(usersRes || []);
                setProducts(productsRes?.content || productsRes || []);
            } finally {
                setLoadingUsers(false);
                setLoadingProducts(false);
            }
        };
        fetchData();
    }, []);

    // ==============================
    // Set initial values
    // ==============================
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            veterinarianId: initialValues?.veterinarianId || user?.id || "",
        }));
    }, [initialValues, user]);

    // ==============================
    // Validation logic
    // ==============================
    const canSubmit = useMemo(() => {
        return (
            form.consultationType &&
            form.consultationReason &&
            form.date &&
            form.veterinarianId &&
            form.petId
        );
    }, [form]);

    // ==============================
    // Handlers
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    // Handle multiple product selection
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
                form.diagnosis === "Otro" ? form.customDiagnosis : form.diagnosis,
        };
        delete payload.customDiagnosis;
        onSubmit?.(payload);
    };

    // ==============================
    // UI
    // ==============================
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/*  Consultation Type  */}
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

                {/* Consultation Reason  */}
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

                {/* Date */}
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

                {/* Diagnosis */}
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

                {/* Custom Diagnosis */}
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

                {/* Treatment */}
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

                {/* Used Products */}
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

                {/* Observations */}
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

                {/* Veterinarian */}
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

                {/* Pet ID */}
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

                {/* Buttons */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => window.history.back()}
                        >
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
