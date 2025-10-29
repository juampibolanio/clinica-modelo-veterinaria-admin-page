import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppointmentForm from "../components/AppointmentForm";
import { getAppointmentById, patchAppointment } from "../api/appointments.api";
import dayjs from "dayjs";

const normalizeToForm = (a) => ({
    date: a?.date || dayjs().format("YYYY-MM-DD"),
    time: (a?.time || "").slice(0, 5),
    reason: a?.reason || "",
    notes: a?.notes || "",
    status: a?.status || "PENDIENTE",
    veterinarianId: a?.veterinarianId || "",
    ownerId: a?.ownerId || "",
    petId: a?.petId || "",
});

const AppointmentEdit = () => {
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [item, setItem] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const data = await getAppointmentById(id);
                setItem(normalizeToForm(data));
            } catch {
                enqueueSnackbar("Error al cargar el turno", { variant: "error" });
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handleSubmit = async (formPayload) => {
        try {
            setSaving(true);
            // PATCH solo diferencias
            const updates = {};
            Object.keys(formPayload).forEach(k => {
                if (formPayload[k] !== item[k]) updates[k] = formPayload[k];
            });
            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }
            await patchAppointment(id, updates);
            enqueueSnackbar("Turno actualizado", { variant: "success" });
            navigate(`/appointments/${id}`);
        } catch {
            enqueueSnackbar("No se pudo actualizar", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Editar turno</Typography>
            <AppointmentForm initialValues={item} onSubmit={handleSubmit} saving={saving} />
        </Stack>
    );
};

export default AppointmentEdit;
