import { useEffect, useState, useMemo } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { getAllUsers } from "../../users/api/users.api";
import { getProducts } from "../../products/api/products.api";
import { listClinicalHistory } from "../../clinical-history/api/clinical-history.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

/**
 * AppliedVaccineForm
 * Handles creation and edition of applied vaccines.
 */
const AppliedVaccineForm = ({ initialValues, onSubmit, saving, petId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // ==============================
    // State
    // ==============================
    const [form, setForm] = useState({
        petId: "",
        veterinarianId: "",
        productId: "",
        clinicalHistoryId: "",
        date: dayjs().format("YYYY-MM-DD"),
        observations: "",
    });
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==============================
    // Effects - Initialize form
    // ==============================
    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            petId: petId || initialValues?.petId || "",
            veterinarianId: initialValues?.veterinarianId || user?.id || "",
        }));
    }, [initialValues, petId, user]);

    // ==============================
    // Effects - Load data
    // ==============================
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [usersRes, productsRes, historiesRes] = await Promise.all([
                    getAllUsers(),
                    getProducts(),
                    listClinicalHistory({ petId }),
                ]);

                const allProducts = productsRes.content || productsRes;
                const vaccineProducts = allProducts.filter(
                    (p) =>
                        p.categoryName &&
                        p.categoryName.toLowerCase().includes("vacuna")
                );

                setUsers(usersRes);
                setProducts(vaccineProducts);
                setHistories(historiesRes.content || historiesRes);
            } catch (err) {
                console.error("Error loading applied vaccine form data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [petId]);

    // ==============================
    // Handlers
    // ==============================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    const vaccineOptions = useMemo(() => products.length > 0, [products]);
    const historyOptions = useMemo(() => histories.length > 0, [histories]);

    // ==============================
    // Render
    // ==============================
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Fecha */}
                <Grid item xs={12} md={4}>
                    <TextField
                        type="date"
                        label="Fecha"
                        name="date"
                        fullWidth
                        value={form.date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                </Grid>

                {/* Producto (vacuna) */}
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        label="Vacuna (producto)"
                        name="productId"
                        fullWidth
                        value={form.productId || ""}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        {!vaccineOptions && (
                            <MenuItem disabled>No hay vacunas disponibles</MenuItem>
                        )}
                        {products.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.name} — Stock: {p.stock}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Historia clínica */}
                <Grid item xs={12} md={4}>
                    <TextField
                        select
                        label="Historia clínica"
                        name="clinicalHistoryId"
                        fullWidth
                        value={form.clinicalHistoryId || ""}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        {!historyOptions && (
                            <MenuItem disabled>No hay historias clínicas disponibles</MenuItem>
                        )}
                        {histories.map((h) => (
                            <MenuItem key={h.id} value={h.id}>
                                {dayjs(h.date).format("DD/MM/YYYY")} — {h.consultationType}
                            </MenuItem>
                        ))}
                    </TextField>
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
                        disabled={loading}
                    >
                        {users.map((u) => (
                            <MenuItem key={u.id} value={u.id}>
                                {u.name} {u.surname}
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

                {/* Actions */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? (
                                <CircularProgress size={22} color="inherit" />
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {/* Loader general */}
            {loading && (
                <Stack alignItems="center" mt={3}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" mt={1}>
                        Cargando datos...
                    </Typography>
                </Stack>
            )}
        </form>
    );
};

export default AppliedVaccineForm;
