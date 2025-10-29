import { useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserForm from "../components/UserForm";
import { createUser } from "../api/users.api";

/**
 * Page: Create User
 * Displays form for creating a new user (ADMIN only)
 */
const UserCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createUser(formData);
            enqueueSnackbar("Usuario creado correctamente ✅", { variant: "success" });
            navigate("/security");
        } catch (error) {
            console.error("Error al crear usuario:", error);
            enqueueSnackbar("Error al crear el usuario", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nuevo Usuario
            </Typography>

            {saving && (
                <Stack alignItems="center" justifyContent="center" mt={2}>
                    <CircularProgress size={28} />
                </Stack>
            )}

            <UserForm onSubmit={handleSubmit} saving={saving} />
        </Stack>
    );
};

export default UserCreate;
