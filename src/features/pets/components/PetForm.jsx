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
    CircularProgress,
    Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema } from "../schema/pet.schema";
import { petFormStyles } from "../styles/petForm.styles";
import { useNavigate } from "react-router-dom";

/**
 * PetForm — Unified form for creating and editing pets.
 * Uses Zod + React Hook Form + consistent MUI design.
 */
const PetForm = ({ onSubmit, submitting = false, defaultValues = {}, mode = "create" }) => {
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(petSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            species: "",
            breed: "",
            gender: "",
            color: "",
            weight: "",
            birthDate: "",
            allergies: "",
            ownerId: "",
            ...defaultValues,
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={4} sx={petFormStyles.form}>
                {/* Grid of fields */}
                <Grid container spacing={3}>
                    {/* Nombre */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Nombre *"
                                    fullWidth
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                    sx={petFormStyles.textField}
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
                                    <Select
                                        {...field}
                                        displayEmpty
                                        renderValue={(value) => (value ? value : "Especie")}
                                        sx={petFormStyles.select}
                                    >
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
                                <TextField {...field} label="Raza" fullWidth sx={petFormStyles.textField} />
                            )}
                        />
                    </Grid>

                    {/* Sexo */}
                    <Grid item xs={12} sm={6} md={4}>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={!!errors.gender}>
                                    <Select
                                        {...field}
                                        displayEmpty
                                        renderValue={(value) => (value ? (value === "MALE" ? "Macho" : "Hembra") : "Sexo")}
                                        sx={petFormStyles.select}
                                    >
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
                                <TextField {...field} label="Color" fullWidth sx={petFormStyles.textField} />
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
                                    sx={petFormStyles.textField}
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
                                    sx={petFormStyles.textField}
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
                                <TextField {...field} label="Alergias" fullWidth sx={petFormStyles.textField} />
                            )}
                        />
                    </Grid>

                    {/* ID del dueño */}
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
                                    sx={petFormStyles.textField}
                                />
                            )}
                        />
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    justifyContent="flex-end"
                    sx={petFormStyles.actionsContainer}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(-1)}
                        sx={petFormStyles.cancelButton}
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!isValid || submitting}
                        sx={petFormStyles.submitButton}
                    >
                        {submitting ? (
                            <CircularProgress size={22} sx={{ color: "white" }} />
                        ) : mode === "edit" ? (
                            "Guardar cambios"
                        ) : (
                            "Crear mascota"
                        )}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};

export default PetForm;
