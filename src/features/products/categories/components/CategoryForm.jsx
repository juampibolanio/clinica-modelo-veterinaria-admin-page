import { useState, useMemo } from "react";
import {
    Stack,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";

/**
 * CategoryForm
 * Handles creation and edition of product categories.
 */
const CategoryForm = ({
    initialValues = { name: "", description: "" },
    onSubmit,
    loading = false,
}) => {
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
        <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
                {/* Category name */}
                <TextField
                    label="Nombre"
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
                />

                {/* Category description */}
                <TextField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    minRows={3}
                    fullWidth
                />

                {/* Buttons */}
                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.history.back()}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={!canSubmit || loading}
                    >
                        {loading ? (
                            <CircularProgress size={22} color="inherit" />
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default CategoryForm;
