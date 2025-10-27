import { useState } from 'react';
import { Box, Button, Card, CardContent, Stack, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../features/auth/AuthContext';
import { useSnackbar } from 'notistack';
import { Visibility, VisibilityOff, Person, Lock } from '@mui/icons-material';

const schema = z.object({
    username: z.string().min(3, 'Ingrese su usuario'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const Login = () => {
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #E6F7FF 0%, #d0ebff 100%)',
                px: { xs: 2, sm: 3 },
                py: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: { xs: '300px', md: '500px' },
                    height: { xs: '300px', md: '500px' },
                    borderRadius: '50%',
                    background: 'rgba(55, 129, 227, 0.08)',
                    filter: 'blur(60px)',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-15%',
                    left: '-10%',
                    width: { xs: '350px', md: '600px' },
                    height: { xs: '350px', md: '600px' },
                    borderRadius: '50%',
                    background: 'rgba(112, 39, 160, 0.06)',
                    filter: 'blur(80px)',
                },
            }}
        >
            <Card
                sx={{
                    width: '100%',
                    maxWidth: 460,
                    boxShadow: '0 20px 60px rgba(55, 129, 227, 0.15), 0 8px 16px rgba(0, 0, 0, 0.05)',
                    borderRadius: 3,
                    position: 'relative',
                    zIndex: 1,
                    border: '1px solid rgba(55, 129, 227, 0.08)',
                }}
            >
                {/* Header con gradiente */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)',
                        px: { xs: 3, sm: 4 },
                        py: { xs: 4, sm: 5 },
                        textAlign: 'center',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            opacity: 0.4,
                        }
                    }}
                >
                    {/* Ícono veterinario */}
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            bgcolor: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mb: 3,
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3781E3" strokeWidth="2">
                            <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            color: 'white',
                            mb: 1,
                            fontFamily: '"Nunito", Arial, sans-serif',
                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        Clínica Modelo Veterinaria
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            position: 'relative',
                            zIndex: 1,
                        }}
                    >
                        Panel Administrativo
                    </Typography>
                </Box>

                <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            fontWeight: 700,
                            color: '#2B2B2B',
                            fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        }}
                    >
                        Iniciar Sesión
                    </Typography>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Stack spacing={3}>
                            <TextField
                                label="Nombre de usuario"
                                fullWidth
                                {...register('username')}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person sx={{ color: '#3781E3' }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#3781E3',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 0 0 3px rgba(55, 129, 227, 0.1)',
                                        },
                                    },
                                }}
                            />
                            <TextField
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: '#3781E3' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                sx={{ color: '#3781E3' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#3781E3',
                                            },
                                        },
                                        '&.Mui-focused': {
                                            boxShadow: '0 0 0 3px rgba(55, 129, 227, 0.1)',
                                        },
                                    },
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    background: 'linear-gradient(135deg, #3781E3 0%, #5a9aeb 100%)',
                                    boxShadow: '0 4px 12px rgba(55, 129, 227, 0.3)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #2970d2 0%, #4989da 100%)',
                                        boxShadow: '0 6px 20px rgba(55, 129, 227, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                    },
                                    '&.Mui-disabled': {
                                        background: '#ccc',
                                        color: '#666',
                                    },
                                }}
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </Button>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;