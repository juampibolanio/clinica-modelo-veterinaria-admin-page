import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { createCategory } from "../api/categories.api";
import CategoryForm from "../components/CategoryForm";

/**
 * CategoryCreate
 * Page for creating a new product category.
 */
const CategoryCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    // ==============================
    // Handle form submission
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createCategory(formData);
            enqueueSnackbar("Categoría creada correctamente ✅", { variant: "success" });
            navigate("/products/categories");
        } catch (err) {
            console.error("Error creating category:", err);
            enqueueSnackbar("Error al crear la categoría", { variant: "error" });
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
                Nueva categoría
            </Typography>
            <CategoryForm onSubmit={handleSubmit} loading={saving} />
        </Stack>
    );
};

export default CategoryCreate;
