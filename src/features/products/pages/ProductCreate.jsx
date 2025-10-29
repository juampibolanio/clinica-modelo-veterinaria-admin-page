import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { createProduct } from "../api/products.api";
import ProductForm from "../components/ProductForm";

/**
 * ProductCreate
 * Page for creating a new product.
 */
const ProductCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    // ==============================
    // Handle form submission
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createProduct(formData);
            enqueueSnackbar("Producto creado correctamente ✅", { variant: "success" });
            navigate("/products");
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al crear el producto", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nuevo producto
            </Typography>
            <ProductForm onSubmit={handleSubmit} loading={saving} />
        </Stack>
    );
};

export default ProductCreate;
