import React, { useEffect, useState } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { getAllUsers } from "../../users/api/users.api";
import { getProducts } from "../../products/api/products.api";
import { listClinicalHistory } from "../../clinical-history/api/clinical-history.api";
import { useAuth } from "../../auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const empty = {
    petId: "",
    veterinarianId: "",
    productId: "",
    clinicalHistoryId: "",
    date: dayjs().format("YYYY-MM-DD"),
    observations: "",
};

const AppliedVaccineForm = ({ initialValues, onSubmit, saving, petId }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState(empty);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [histories, setHistories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...(initialValues || {}),
            petId: petId || initialValues?.petId || "",
            veterinarianId: initialValues?.veterinarianId || user?.id || "",
        }));
    }, [initialValues, petId, user]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, productsRes, historiesRes] = await Promise.all([
                    getAllUsers(),
                    getProducts(),
                    listClinicalHistory({ petId }),
                ]);

                // 🔹 Solo productos categoría "Vacunas"
                const allProducts = productsRes.content || productsRes;
                const vaccineProducts = allProducts.filter(
                    (p) =>
                        p.categoryName &&
                        p.categoryName.toLowerCase().includes("vacuna")
                );

                setUsers(usersRes);
                setProducts(vaccineProducts);
                setHistories(historiesRes.content || historiesRes);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [petId]);

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

                {/* Producto */}
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
                        {products.length === 0 ? (
                            <MenuItem disabled>
                                No hay productos de categoría “Vacunas”
                            </MenuItem>
                        ) : (
                            products.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.name} — Stock: {p.stock}
                                </MenuItem>
                            ))
                        )}
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
                        {histories.map((h) => (
                            <MenuItem key={h.id} value={h.id}>
                                {dayjs(h.date).format("DD/MM/YYYY")} – {h.consultationType}
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

                {/* ✅ Botones Guardar / Cancelar */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={saving}
                        >
                            {saving ? "Guardando..." : "Guardar"}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>

            {loading && (
                <Stack direction="row" justifyContent="center" mt={2}>
                    <CircularProgress size={28} />
                </Stack>
            )}
        </form>
    );
};

export default AppliedVaccineForm;
