import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserForm from "../components/UserForm";
import { createUser } from "../api/users.api";

const UserCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createUser(formData);
            enqueueSnackbar("Usuario creado correctamente", { variant: "success" });
            navigate("/security");
        } catch (err) {
            console.error(err);
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
            <UserForm onSubmit={handleSubmit} saving={saving} />
        </Stack>
    );
};

export default UserCreate;
