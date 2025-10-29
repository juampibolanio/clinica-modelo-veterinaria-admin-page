import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, patchProduct } from "../api/products.api";
import ProductForm from "../components/ProductForm";

/**
 * ProductEdit
 * Page for editing an existing product.
 */
const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==============================
    // Fetch product data
    // ==============================
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error(err);
                enqueueSnackbar("Error al cargar el producto", { variant: "error" });
                navigate("/products");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    // ==============================
    // Handle form submission
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // Build partial update object (only changed fields)
            const updates = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== product[key]) {
                    updates[key] = formData[key];
                }
            });

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchProduct(id, updates);
            enqueueSnackbar("Producto actualizado correctamente ✅", { variant: "success" });
            navigate("/products");
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al actualizar el producto", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    // ==============================
    // Loading state
    // ==============================
    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );

    // ==============================
    // Render
    // ==============================
    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar producto
            </Typography>
            <ProductForm initialValues={product} onSubmit={handleSubmit} loading={saving} />
        </Stack>
    );
};

export default ProductEdit;
