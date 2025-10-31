import { useState, useMemo } from "react";
import {
    Box,
    Stack,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { categoryFormStyles } from "../styles/categoryForm.styles";

/**
 * CategoryForm
 * Handles creation and edition of product categories with unified styling.
 */
const CategoryForm = ({
    initialValues = { name: "", description: "" },
    onSubmit,
    loading = false,
}) => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialValues);

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

    const canSubmit = useMemo(() => form.name.trim().length > 0, [form.name]);

    // ==============================
    // UI render
    // ==============================
    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={categoryFormStyles.form}
        >
            <Stack spacing={2}>
                {/* Nombre */}
                <TextField
                    label="Nombre de la categoría"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    helperText={
                        form.name.trim() === ""
                            ? "El nombre de la categoría es obligatorio"
                            : " "
                    }
                    sx={categoryFormStyles.textField}
                />

                {/* Descripción */}
                <TextField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                    sx={categoryFormStyles.textField}
                />

                {/* Botones */}
                <Stack sx={categoryFormStyles.actionsContainer}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                        sx={categoryFormStyles.cancelButton}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!canSubmit || loading}
                        sx={categoryFormStyles.submitButton}
                    >
                        {loading ? (
                            <CircularProgress size={22} sx={{ color: "white" }} />
                        ) : (
                            "Guardar categoría"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};

export default CategoryForm;
