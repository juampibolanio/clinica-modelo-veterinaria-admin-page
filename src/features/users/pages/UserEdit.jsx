import { useState, useEffect } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import UserForm from "../components/UserForm";
import { getUserById, patchUser } from "../api/users.api";

/**
 * Page: Edit User
 * Loads existing user data and updates only changed fields.
 */
const UserEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState(null);

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserById(id);
                setUserData(data);
            } catch (error) {
                console.error("Error al cargar usuario:", error);
                enqueueSnackbar("Error al cargar el usuario", { variant: "error" });
                navigate("/security");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, navigate, enqueueSnackbar]);

    // Handle submit (PATCH only changed fields)
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            // Build PATCH payload only with changed fields
            const updates = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value !== userData[key] && value !== undefined && value !== "") {
                    acc[key] = value;
                }
                return acc;
            }, {});

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchUser(id, updates);
            enqueueSnackbar("Usuario actualizado correctamente ✅", { variant: "success" });
            navigate("/security");
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            enqueueSnackbar("Error al actualizar el usuario", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading)
        return (
            <Stack alignItems="center" justifyContent="center" mt={4}>
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
