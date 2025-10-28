// src/modules/products/categories/pages/CategoryCreate.jsx
import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { createCategory } from "../api/categories.api";
import CategoryForm from "../components/CategoryForm";

const CategoryCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (form) => {
        try {
            setLoading(true);
            await createCategory(form);
            enqueueSnackbar("Categoría creada correctamente", { variant: "success" });
            navigate("/products/categories");
        } catch {
            enqueueSnackbar("Error al crear la categoría", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Nueva Categoría</Typography>
            <CategoryForm onSubmit={handleSubmit} loading={loading} />
        </Stack>
    );
};

export default CategoryCreate;
