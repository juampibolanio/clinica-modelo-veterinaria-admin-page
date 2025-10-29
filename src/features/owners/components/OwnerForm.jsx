import React, { useEffect, useState } from "react";
import { Box, Grid, Stack, TextField, Button } from "@mui/material";

const emptyForm = {
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    address: "",
    documentNumber: "",
};

const OwnerForm = ({ defaultValues, onSubmit, submitting, mode = "create" }) => {
    const [form, setForm] = useState(() => ({
        ...emptyForm,
        ...(defaultValues || {}),
    }));

    useEffect(() => {
        if (defaultValues) setForm((prev) => ({ ...prev, ...defaultValues }));
    }, [defaultValues]);

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
                {[
                    ["name", "Nombre", true],
                    ["surname", "Apellido", true],
                    ["email", "Email"],
                    ["phoneNumber", "Teléfono"],
                    ["address", "Dirección"],
                    ["documentNumber", "N° Documento"],
                ].map(([name, label, required]) => (
                    <Grid item xs={12} sm={6} key={name}>
                        <TextField
                            label={label}
                            name={name}
                            value={form[name]}
                            onChange={handleChange}
                            fullWidth
                            required={required}
                            size="small"
                        />
                    </Grid>
                ))}
            </Grid>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={3} justifyContent="flex-end">
                <Button variant="outlined" color="secondary" onClick={() => window.history.back()}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                >
                    {submitting
                        ? "Guardando..."
                        : mode === "edit"
                            ? "Guardar cambios"
                            : "Crear dueño"}
                </Button>
            </Stack>
        </Box>
    );
};

export default OwnerForm;
