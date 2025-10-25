import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../features/auth/AuthContext';
import { useSnackbar } from 'notistack';

const schema = z.object({
    username: z.string().min(3, 'Ingrese su usuario'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Login = () => {
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: { username: '', password: '' },
    });

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            await login(values);
            enqueueSnackbar('Bienvenido 👋', { variant: 'success' });
            window.location.href = '/';
        } catch (e) {
            enqueueSnackbar(e.message || 'No se pudo iniciar sesión', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'background.default',
                px: 2,
            }}
        >
            <Card sx={{ width: '100%', maxWidth: 420, boxShadow: '0 4px 12px rgba(0,0,0,0.10)', borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Stack spacing={2}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                Clínica Modelo Veterinaria
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Panel administrativo — Iniciar sesión</Typography>
                        </Box>

                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                            <Stack spacing={2}>
                                <TextField
                                    label="Nombre de usuario"
                                    fullWidth
                                    {...register('username')}
                                    error={!!errors.username}
                                    helperText={errors.username?.message}
                                />
                                <TextField
                                    label="Contraseña"
                                    type="password"
                                    fullWidth
                                    {...register('password')}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                />
                                <Button type="submit" variant="contained" color="primary" size="large" disabled={loading}>
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
