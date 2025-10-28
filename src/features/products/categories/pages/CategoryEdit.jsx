// src/modules/products/categories/pages/CategoryEdit.jsx
import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress, Box } from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById, patchCategory } from "../api/categories.api";
import CategoryForm from "../components/CategoryForm";

const CategoryEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCategoryById(id);
                setCategory(data);
            } catch {
                enqueueSnackbar("Error al cargar la categoría", { variant: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (form) => {
        try {
            setSaving(true);
            await patchCategory(id, form);
            enqueueSnackbar("Categoría actualizada correctamente", { variant: "success" });
            navigate("/products/categories");
        } catch {
            enqueueSnackbar("Error al actualizar la categoría", { variant: "error" });
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
            <Typography variant="h4" fontWeight={800}>Editar Categoría</Typography>
            <CategoryForm initialValues={category} onSubmit={handleSubmit} loading={saving} />
        </Stack>
    );
};

export default CategoryEdit;
