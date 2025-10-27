import React from "react";
import {
    Stack,
    TextField,
    Button,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// ✅ Esquema de validación con Zod
const schema = z.object({
    name: z.string().min(2, "El nombre es obligatorio"),
    species: z.string().min(1, "Selecciona una especie"),
    breed: z.string().optional(),
    gender: z.string().min(1, "Selecciona un género"),
    color: z.string().optional(),
    weight: z
        .number({ invalid_type_error: "El peso debe ser un número" })
        .nonnegative("El peso no puede ser negativo"),
    birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
    allergies: z.string().optional(),
    ownerId: z.number({ invalid_type_error: "El ID del dueño es requerido" }),
});

const PetForm = ({ onSubmit, submitting = false, defaultValues = {}, mode = "create" }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            name: defaultValues.name || "",
            species: defaultValues.species || "",
            breed: defaultValues.breed || "",
            gender: defaultValues.gender || "",
            color: defaultValues.color || "",
            weight: defaultValues.weight || 0,
            birthDate: defaultValues.birthDate || "",
            allergies: defaultValues.allergies || "",
            ownerId: defaultValues.ownerId || "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            )}
                        />
                    </Grid>

                    {/* ✅ Select especie */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="species"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.species}>
                                    <InputLabel>Especie</InputLabel>
                                    <Select {...field} label="Especie">
                                        <MenuItem value="">
                                            <em>Seleccionar</em>
                                        </MenuItem>
                                        <MenuItem value="Perro">Perro</MenuItem>
                                        <MenuItem value="Gato">Gato</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="breed"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Raza" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* ✅ Select género */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.gender}>
                                    <InputLabel>Género</InputLabel>
                                    <Select {...field} label="Género">
                                        <MenuItem value="">
                                            <em>Seleccionar</em>
                                        </MenuItem>
                                        <MenuItem value="MALE">Macho</MenuItem>
                                        <MenuItem value="FEMALE">Hembra</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="color"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Color" fullWidth />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Peso (kg)"
                                    type="number"
                                    fullWidth
                                    error={!!errors.weight}
                                    helperText={errors.weight?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Fecha de nacimiento"
                                    type="date"
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    error={!!errors.birthDate}
                                    helperText={errors.birthDate?.message}
                                />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="allergies"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Alergias" fullWidth />
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="ownerId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="ID del dueño"
                                    type="number"
                                    fullWidth
                                    error={!!errors.ownerId}
                                    helperText={errors.ownerId?.message}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={submitting}
                    sx={{ alignSelf: "flex-start" }}
                >
                    {submitting ? "Guardando..." : mode === "edit" ? "Actualizar" : "Crear"}
                </Button>
            </Stack>
        </form>
    );
};

export default PetForm;
