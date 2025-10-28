import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserForm from "../components/UserForm";
import { getUserById, patchUser } from "../api/users.api";

const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUserData(data);
            } catch {
                enqueueSnackbar("Error al cargar el usuario", { variant: "error" });
                navigate("/security");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            // Solo mandamos los cambios (PATCH)
            const updates = {};
            Object.keys(formData).forEach((k) => {
                if (formData[k] !== userData[k] && formData[k] !== undefined) {
                    updates[k] = formData[k];
                }
            });

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchUser(id, updates);
            enqueueSnackbar("Usuario actualizado correctamente", { variant: "success" });
            navigate("/security");
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al actualizar el usuario", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Stack alignItems="center" mt={4}>
                <CircularProgress />
            </Stack>
        );

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar Usuario
            </Typography>
            <UserForm initialValues={userData} onSubmit={handleSubmit} saving={saving} />
        </Stack>
    );
};

export default UserEdit;
