import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { createProduct } from "../api/products.api";
import ProductForm from "../components/ProductForm";

const ProductCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (form) => {
        try {
            setLoading(true);
            await createProduct(form);
            enqueueSnackbar("Producto creado correctamente ✅", { variant: "success" });
            navigate("/products");
        } catch {
            enqueueSnackbar("Error al crear el producto", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Nuevo Producto</Typography>
            <ProductForm onSubmit={handleSubmit} loading={loading} />
        </Stack>
    );
};

export default ProductCreate;
