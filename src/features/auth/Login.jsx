import { Box, Card, CardContent, Typography } from "@mui/material";
import LoginForm from "./components/LoginForm";
import { loginStyles } from "./styles/login.styles";

const Login = () => {
    return (
        <Box sx={loginStyles.pageContainer}>
            <Card sx={loginStyles.card}>
                {/* Header */}
                <Box sx={loginStyles.header}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: "white",
                            mb: 1,
                            fontFamily: '"Nunito", Arial, sans-serif',
                        }}
                    >
                        Clínica Modelo Veterinaria
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255, 255, 255, 0.9)",
                            fontWeight: 500,
                        }}
                    >
                        Panel Administrativo
                    </Typography>
                </Box>

                {/* Content */}
                <CardContent sx={loginStyles.cardContent}>
                    <Typography variant="h6" sx={loginStyles.formTitle}>
                        Iniciar Sesión
                    </Typography>
                    <LoginForm />
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
