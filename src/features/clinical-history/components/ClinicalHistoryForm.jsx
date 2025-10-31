import {
    Stack,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
    Chip,
    Box,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { getAllUsers } from "../../users/api/users.api";
import { getProducts } from "../../products/api/products.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { CONSULTATION_TYPES } from "../constants/consultation-types";
import { COMMON_DIAGNOSES } from "../constants/common-diagnoses";
import { clinicalHistoryFormStyles } from "../styles/clinicalHistoryForm.styles";

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
 * ClinicalHistoryForm — visualmente igual al formulario de Turnos
 */
const ClinicalHistoryForm = ({ initialValues = {}, onSubmit, saving }) => {
    const [form, setForm] = useState(emptyForm);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { user } = useAuth();

    // Fetch veterinarios y productos
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

    // Inicializa valores
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            veterinarianId: initialValues?.veterinarianId || user?.id || "",
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

    // Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

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

    // Loader inicial
    if (loadingUsers && loadingProducts)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={clinicalHistoryFormStyles.form}
        >
            <Stack spacing={2}>
                <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                        background: "linear-gradient(135deg, #3781E3 0%, #7027A0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Datos de la Historia Clínica
                </Typography>

                {/* Tipo de consulta */}
                <TextField
                    select
                    label="Tipo de consulta"
                    name="consultationType"
                    value={form.consultationType || ""}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={clinicalHistoryFormStyles.textField}
                >
                    {CONSULTATION_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>
                            {t}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Motivo */}
                <TextField
                    label="Motivo de consulta"
                    name="consultationReason"
                    value={form.consultationReason || ""}
                    onChange={handleChange}
                    required
                    sx={clinicalHistoryFormStyles.textField}
                />

                {/* Fecha */}
                <TextField
                    type="date"
                    label="Fecha"
                    name="date"
                    value={form.date || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    required
                    sx={clinicalHistoryFormStyles.textField}
                />

                {/* Diagnóstico */}
                <TextField
                    select
                    label="Diagnóstico"
                    name="diagnosis"
                    value={form.diagnosis || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    sx={clinicalHistoryFormStyles.textField}
                >
                    {COMMON_DIAGNOSES.map((d) => (
                        <MenuItem key={d} value={d}>
                            {d}
                        </MenuItem>
                    ))}
                    <MenuItem value="Otro">Otro...</MenuItem>
                </TextField>

                {/* Diagnóstico personalizado */}
                {form.diagnosis === "Otro" && (
                    <TextField
                        label="Especificar diagnóstico"
                        name="customDiagnosis"
                        fullWidth
                        value={form.customDiagnosis || ""}
                        onChange={handleChange}
                        required
                        sx={clinicalHistoryFormStyles.textField}
                    />
                )}

                {/* Tratamiento */}
                <TextField
                    label="Tratamiento"
                    name="treatment"
                    fullWidth
                    value={form.treatment || ""}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    sx={clinicalHistoryFormStyles.textField}
                />

                {/* Productos utilizados */}
                <TextField
                    select
                    label="Productos utilizados"
                    name="usedProductIds"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    SelectProps={{
                        multiple: true,
                        renderValue: (selected) => (
                            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ p: 0.3 }}>
                                {selected.map((id) => {
                                    const prod = products.find((p) => p.id === id);
                                    return (
                                        <Chip
                                            key={id}
                                            label={prod ? prod.name : id}
                                            size="small"
                                            sx={clinicalHistoryFormStyles.chip}
                                        />
                                    );
                                })}
                            </Stack>
                        ),
                    }}
                    value={form.usedProductIds || []}
                    onChange={handleProductSelect}
                    disabled={loadingProducts}
                    sx={clinicalHistoryFormStyles.textField}
                >
                    {loadingProducts ? (
                        <MenuItem disabled>
                            <CircularProgress size={18} sx={{ mr: 1 }} /> Cargando...
                        </MenuItem>
                    ) : (
                        products.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name} — Stock: {p.stock}
                            </MenuItem>
                        ))
                    )}
                </TextField>

                {/* Observaciones */}
                <TextField
                    label="Observaciones"
                    name="observations"
                    fullWidth
                    value={form.observations || ""}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    sx={clinicalHistoryFormStyles.textField}
                />

                {/* Veterinario */}
                <TextField
                    select
                    label="Veterinario"
                    name="veterinarianId"
                    fullWidth
                    value={form.veterinarianId || ""}
                    onChange={handleChange}
                    required
                    disabled={loadingUsers}
                    InputLabelProps={{ shrink: true }}
                    sx={clinicalHistoryFormStyles.textField}
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

                {/* ID Mascota */}
                <TextField
                    label="ID Mascota"
                    name="petId"
                    type="number"
                    fullWidth
                    value={form.petId || ""}
                    onChange={handleChange}
                    required
                    disabled
                    sx={clinicalHistoryFormStyles.textField}
                />

                {/* Botones */}
                <Stack sx={clinicalHistoryFormStyles.actionsContainer}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.history.back()}
                        sx={clinicalHistoryFormStyles.cancelButton}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!canSubmit || saving}
                        sx={clinicalHistoryFormStyles.submitButton}
                    >
                        {saving ? (
                            <CircularProgress size={22} sx={{ color: "white" }} />
                        ) : (
                            "Guardar historia"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default ClinicalHistoryForm;
