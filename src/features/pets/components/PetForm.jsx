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
import { petSchema } from "../schema/pet.schema";

/**
 * PetForm
 * Form for creating or editing a pet.
 * Validated with Zod, fully typed, and modular.
 */
const PetForm = ({ onSubmit, submitting = false, defaultValues = {}, mode = "create" }) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: defaultValues.name ?? "",
            species: defaultValues.species ?? "",
            breed: defaultValues.breed ?? "",
            gender: defaultValues.gender ?? "",
            color: defaultValues.color ?? "",
            weight: defaultValues.weight ?? "",
            birthDate: defaultValues.birthDate ?? "",
            allergies: defaultValues.allergies ?? "",
            ownerId: defaultValues.ownerId ?? "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
                <Grid container spacing={2}>
                    {/* Nombre */}
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

                    {/* Especie */}
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

                    {/* Raza */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="breed"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Raza" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Género */}
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

                    {/* Color */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="color"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Color" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Peso */}
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
                                    onChange={(e) =>
                                        field.onChange(e.target.value === "" ? "" : e.target.value)
                                    }
                                    inputProps={{ step: "0.01", min: 0 }}
                                />
                            )}
                        />
                    </Grid>

                    {/* Fecha de nacimiento */}
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

                    {/* Alergias */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="allergies"
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} label="Alergias" fullWidth />
                            )}
                        />
                    </Grid>

                    {/* Dueño */}
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
                                    onChange={(e) =>
                                        field.onChange(e.target.value === "" ? "" : e.target.value)
                                    }
                                    inputProps={{ min: 1 }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Botones */}
                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => window.history.back()}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={submitting}>
                        {submitting
                            ? "Guardando..."
                            : mode === "edit"
                                ? "Actualizar"
                                : "Crear"}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default PetForm;
