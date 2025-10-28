import React, { useState, useEffect, useMemo } from "react";
import {
    Grid,
    TextField,
    MenuItem,
    Stack,
    Button,
    CircularProgress,
} from "@mui/material";

const emptyUser = {
    username: "",
    name: "",
    surname: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "USER",
};

const UserForm = ({ initialValues, onSubmit, saving }) => {
    const [form, setForm] = useState(emptyUser);
    const [showPassword, setShowPassword] = useState(false);

    // Cargar valores iniciales (modo edición)
    useEffect(() => {
        if (initialValues) {
            setForm((prev) => ({
                ...prev,
                ...initialValues,
                password: "", // nunca traemos el password
            }));
        }
    }, [initialValues]);

    // Validación básica
    const canSubmit = useMemo(() => {
        return (
            form.username &&
            form.name &&
            form.surname &&
            form.email &&
            (initialValues ? true : form.password) // password requerido solo en creación
        );
    }, [form, initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit?.(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                {/* Username */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Usuario"
                        name="username"
                        fullWidth
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Nombre */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Nombre"
                        name="name"
                        fullWidth
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Apellido */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Apellido"
                        name="surname"
                        fullWidth
                        value={form.surname}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Teléfono"
                        name="phoneNumber"
                        fullWidth
                        value={form.phoneNumber}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Contraseña */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Contraseña"
                        name="password"
                        type="password"
                        fullWidth
                        value={form.password}
                        onChange={handleChange}
                        required={!initialValues} // obligatorio solo si se crea
                    />
                </Grid>

                {/* Rol */}
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Rol"
                        name="role"
                        fullWidth
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="USER">Usuario</MenuItem>
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                    </TextField>
                </Grid>

                {/* Botón */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!canSubmit || saving}
                        >
                            {saving ? (
                                <>
                                    <CircularProgress size={18} sx={{ mr: 1 }} />
                                    Guardando...
                                </>
                            ) : (
                                "Guardar"
                            )}
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
        </form>
    );
};

export default UserForm;
