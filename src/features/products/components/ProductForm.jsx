import { useEffect, useState, useMemo } from "react";
import {
    Stack,
    TextField,
    Button,
    CircularProgress,
    MenuItem,
    Typography,
} from "@mui/material";
import { getCategories } from "../categories/api/categories.api";
import { PRODUCT_TYPES } from "../constants/product-types";

/**
 * ProductForm
 * Handles creation and editing of a product.
 */
const ProductForm = ({ initialValues, onSubmit, loading }) => {
    // ==============================
    // State
    // ==============================
    const [form, setForm] = useState({
        name: "",
        type: "",
        stock: 0,
        categoryId: "",
        ...(initialValues || {}),
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    // ==============================
    // Fetch categories
    // ==============================
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await getCategories();
                setCategories(data.content || data || []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

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

    const canSubmit = useMemo(() => {
        return form.name && form.type && form.categoryId && form.stock >= 0;
    }, [form]);

    // ==============================
    // Loading state
    // ==============================
    if (loadingCategories)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
                <Typography variant="body2" mt={2}>
                    Cargando categorías...
                </Typography>
            </Stack>
        );

    // ==============================
    // UI render
    // ==============================
    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                {/* Product name */}
                <TextField
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    helperText={!form.name ? "El nombre es obligatorio" : " "}
                />

                {/* Product type */}
                <TextField
                    select
                    label="Tipo de producto"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    helperText={!form.type ? "Selecciona un tipo de producto" : " "}
                >
                    {PRODUCT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Stock */}
                <TextField
                    label="Stock disponible"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    required
                    helperText={
                        form.stock < 0
                            ? "El stock no puede ser negativo"
                            : " "
                    }
                />

                {/* Category */}
                <TextField
                    select
                    label="Categoría"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                    helperText={!form.categoryId ? "Selecciona una categoría" : " "}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Buttons */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.history.back()}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!canSubmit || loading}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default ProductForm;
