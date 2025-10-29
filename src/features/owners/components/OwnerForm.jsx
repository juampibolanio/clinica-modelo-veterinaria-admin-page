import {
    Box,
    Grid,
    Stack,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSchema } from "../schemas/owner.schema";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * OwnerForm - Unified form for creating and editing owners.
 * Uses Zod + React Hook Form for validation.
 */
const OwnerForm = ({ defaultValues = {}, onSubmit, submitting, mode = "create" }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
        reset,
    } = useForm({
        resolver: zodResolver(ownerSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            phoneNumber: "",
            address: "",
            documentNumber: "",
            ...defaultValues,
        },
    });

    // Update form when editing
    useEffect(() => {
        if (defaultValues) reset(defaultValues);
    }, [defaultValues, reset]);

    const handleFormSubmit = (data) => {
        onSubmit?.(data);
    };

    return (
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Grid container spacing={2}>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nombre"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                    />
                </Grid>

                {/* Surname */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Apellido"
                        fullWidth
                        {...register("surname")}
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                        required
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Teléfono"
                        fullWidth
                        {...register("phoneNumber")}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                    />
                </Grid>

                {/* Direction */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Dirección"
                        fullWidth
                        {...register("address")}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                    />
                </Grid>

                {/* Document */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="N° Documento"
                        fullWidth
                        {...register("documentNumber")}
                        error={!!errors.documentNumber}
                        helperText={errors.documentNumber?.message}
                    />
                </Grid>
            </Grid>

            {/* Buttons */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                mt={3}
                justifyContent="flex-end"
            >
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    fullWidth
                    sx={{
                        "@media (min-width:600px)": {
                            width: "auto",
                        },
                    }}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isValid || submitting}
                    fullWidth
                    sx={{
                        "@media (min-width:600px)": {
                            width: "auto",
                        },
                    }}
                >
                    {submitting ? (
                        <CircularProgress size={22} />
                    ) : mode === "edit" ? (
                        "Guardar cambios"
                    ) : (
                        "Crear dueño"
                    )}
                </Button>
            </Stack>
        </Box>
    );
};

export default OwnerForm;
