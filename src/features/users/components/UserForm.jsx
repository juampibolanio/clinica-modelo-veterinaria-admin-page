import { useEffect } from "react";
import {
    Grid,
    Stack,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../schemas/user.schema";

/**
 * User form component
 * Handles both creation and edit modes using react-hook-form + zod
 */
const UserForm = ({ initialValues, onSubmit, saving = false }) => {
    const isEdit = !!initialValues;

    // Setup form with defaults and zod validation
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isValid },
    } = useForm({
        resolver: zodResolver(userSchema),
        mode: "onChange",
        defaultValues: {
            username: "",
            name: "",
            surname: "",
            email: "",
            password: "",
            phoneNumber: "",
            role: "USER",
        },
    });

    // Load initial values (edit mode)
    useEffect(() => {
        if (initialValues) {
            Object.entries(initialValues).forEach(([key, value]) => {
                if (key !== "password") setValue(key, value ?? "");
            });
        }
    }, [initialValues, setValue]);

    // Handle submit
    const handleFormSubmit = (data) => {
        // Remove password if empty in edit mode
        if (isEdit && !data.password) {
            delete data.password;
        }
        onSubmit?.(data);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            <Grid container spacing={2}>
                {/* Username */}
                <Grid item xs={12} md={4}>
                    <TextField
                        label="Usuario"
                        fullWidth
                        {...register("username")}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        required
                    />
                </Grid>

                {/* Name */}
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        required
                    />
                </Grid>

                {/* Phone number */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Teléfono"
                        fullWidth
                        {...register("phoneNumber")}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber?.message}
                    />
                </Grid>

                {/* Password */}
                <Grid item xs={12} md={6}>
                    <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        {...register("password")}
                        error={!!errors.password}
                        helperText={
                            isEdit
                                ? "Dejar vacío para mantener la actual"
                                : errors.password?.message
                        }
                        required={!isEdit}
                    />
                </Grid>

                {/* Role */}
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Rol"
                        fullWidth
                        {...register("role")}
                        error={!!errors.role}
                        helperText={errors.role?.message}
                        required
                    >
                        <MenuItem value="USER">Usuario</MenuItem>
                        <MenuItem value="ADMIN">Administrador</MenuItem>
                    </TextField>
                </Grid>

                {/* Buttons */}
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="flex-end" spacing={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid || saving}
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
