import {
    Button,
    Stack,
    TextField,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginSchema } from "../schemas/login.schema";
import { loginStyles } from "../styles/login.styles";

/**
 * LoginForm component handles user login functionality.
 * @returns {JSX.Element} The rendered login form.
 */
const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "", password: "" },
    });

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            await login(values);
            enqueueSnackbar("Bienvenido 👋", { variant: "success" });
            navigate("/");
        } catch (e) {
            enqueueSnackbar(e.message || "No se pudo iniciar sesión", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
                {/* Input fields */}
                <TextField
                    label="Nombre de usuario"
                    fullWidth
                    {...register("username")}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person sx={{ color: "#3781E3" }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={loginStyles.textField}
                />

                <TextField
                    label="Contraseña"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ color: "#3781E3" }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        sx={{ color: "#3781E3" }}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={loginStyles.textField}
                />

                {/* Submit button */}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={loginStyles.submitButton}
                >
                    {loading ? "Ingresando..." : "Ingresar"}
                </Button>
            </Stack>
        </form>
    );
};

export default LoginForm;
