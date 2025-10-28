// src/modules/products/categories/components/CategoryForm.jsx
import { useState } from "react";
import { Stack, TextField, Button, CircularProgress } from "@mui/material";

const CategoryForm = ({ initialValues = { name: "", description: "" }, onSubmit, loading }) => {
    const [form, setForm] = useState(initialValues);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
                <TextField
                    label="Nombre"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Descripción"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                />
                <Button variant="contained" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Guardar"}
                </Button>
            </Stack>
        </form>
    );
};

export default CategoryForm;
