import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, patchCategory } from "../api/categories.api";
import CategoryForm from "../components/CategoryForm";

/**
 * CategoryEdit
 * Page for editing an existing product category.
 */
const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ==============================
    // Fetch category data
    // ==============================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCategoryById(id);
                setCategory(data);
            } catch (err) {
                console.error("Error loading category:", err);
                enqueueSnackbar("Error al cargar la categoría", { variant: "error" });
                navigate("/products/categories");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    // ==============================
    // Handle form submission
    // ==============================
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // Partial update — only send changed fields
            const updates = {};
            Object.keys(formData).forEach((key) => {
                if (formData[key] !== category[key]) updates[key] = formData[key];
            });

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchCategory(id, updates);
            enqueueSnackbar("Categoría actualizada correctamente ✅", { variant: "success" });
            navigate("/products/categories");
        } catch (err) {
            console.error("Error updating category:", err);
            enqueueSnackbar("Error al actualizar la categoría", { variant: "error" });
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
                Editar categoría
            </Typography>
            <CategoryForm
                initialValues={category}
                onSubmit={handleSubmit}
                loading={saving}
            />
        </Stack>
    );
};

export default CategoryEdit;
