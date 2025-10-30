import { Box, Grid, Stack, TextField, Button, CircularProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ownerSchema } from "../schemas/owner.schema";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ownerFormStyles } from "../styles/ownerForm.styles";

/**
 * OwnerForm - Unified form for creating and editing owners.
 * Uses Zod + React Hook Form for validation.
 */
const OwnerForm = ({ defaultValues = {}, onSubmit, submitting, mode = "create" }) => {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
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

    /**
     * Prevents infinite re-renders when defaultValues changes reference.
     * We reset the form only once or when editing mode with valid data.
     */
    useEffect(() => {
        if (mode === "edit" && defaultValues && Object.keys(defaultValues).length > 0) {
            reset(defaultValues);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reset]);

    const handleFormSubmit = (data) => {
        onSubmit?.(data);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(handleFormSubmit)}
            noValidate
            sx={ownerFormStyles.form}
        >
            <Grid container spacing={3}>
                {/* Name */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Nombre *"
                        placeholder="Ingrese el nombre"
                        fullWidth
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                        sx={ownerFormStyles.textField}
                    />
                </Grid>

                {/* Surname */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Apellido *"
                        placeholder="Ingrese el apellido"
                        fullWidth
                        {...register("surname")}
                        error={!!errors.surname}
                        helperText={errors.surname?.message}
                        required
                        sx={ownerFormStyles.textField}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Email"
                        placeholder="ejemplo@email.com"
                        fullWidth
                        type="email"
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={ownerFormStyles.textField}
                    />
                </Grid>

                {/* Phone */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Teléfono"
                        placeholder="Ej: 3795123456"
                        fullWidth
                        {...register("phoneNumber")}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                        sx={ownerFormStyles.textField}
                    />
                </Grid>

                {/* Address */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Dirección"
                        placeholder="Ingrese la dirección"
                        fullWidth
                        {...register("address")}
                        error={!!errors.address}
                        helperText={errors.address?.message}
                        sx={ownerFormStyles.textField}
                    />
                </Grid>

                {/* Document */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="N° Documento"
                        placeholder="Ej: 12345678"
                        fullWidth
                        {...register("documentNumber")}
                        error={!!errors.documentNumber}
                        helperText={errors.documentNumber?.message}
                        sx={ownerFormStyles.textField}
                    />
                </Grid>
            </Grid>

            {/* Action Buttons */}
            <Stack sx={ownerFormStyles.actionsContainer}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => navigate(-1)}
                    sx={ownerFormStyles.cancelButton}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={!isValid || submitting}
                    sx={ownerFormStyles.submitButton}
                >
                    {submitting ? (
                        <CircularProgress size={22} sx={{ color: "white" }} />
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
