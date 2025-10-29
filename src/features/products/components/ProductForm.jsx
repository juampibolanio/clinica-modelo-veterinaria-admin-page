// src/modules/products/components/ProductForm.jsx
import { useEffect, useState } from "react";
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

const ProductForm = ({ initialValues, onSubmit, loading }) => {
    const [form, setForm] = useState(
        initialValues || { name: "", type: "", stock: 0, categoryId: "" }
    );
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data.content || []);
            } catch (err) {
                console.error("Error al cargar categorías", err);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    if (loadingCategories)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
                <Typography variant="body2" mt={2}>
                    Cargando categorías...
                </Typography>
            </Stack>
        );

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />

                <TextField
                    select
                    label="Tipo de producto"
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                >
                    {PRODUCT_TYPES.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Stock"
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    inputProps={{ min: 0 }}
                    required
                />

                <TextField
                    select
                    label="Categoría"
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    required
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                            {cat.name}
                        </MenuItem>
                    ))}
                </TextField>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
                        Cancelar
                    </Button>
                    <Button variant="contained" type="submit" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
                    </Button>
                </Stack>

            </Stack>
        </form>
    );
};

export default ProductForm;
