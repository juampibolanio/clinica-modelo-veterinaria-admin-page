import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, patchProduct } from "../api/products.api";
import ProductForm from "../components/ProductForm";

const ProductEdit = () => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch {
                enqueueSnackbar("Error al cargar el producto", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            setSaving(true);
            await patchProduct(id, form);
            enqueueSnackbar("Producto actualizado correctamente ✅", { variant: "success" });
            navigate("/products");
        } catch {
            enqueueSnackbar("Error al actualizar el producto", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={6}>
                <CircularProgress />
            </Box>
        );

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Editar Producto</Typography>
            <ProductForm initialValues={product} onSubmit={handleSubmit} loading={saving} />
        </Stack>
    );
};

export default ProductEdit;
