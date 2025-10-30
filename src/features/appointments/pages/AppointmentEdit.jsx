import { useEffect, useState } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppointmentForm from "../components/AppointmentForm";
import { getAppointmentById, patchAppointment } from "../api/appointments.api";
import dayjs from "dayjs";

/**
 * Normalizes backend appointment data to match form structure
 */
const normalizeToForm = (a) => ({
    date: a?.date || dayjs().format("YYYY-MM-DD"),
    time: (a?.time || "").slice(0, 5),
    reason: a?.reason || "",
    notes: a?.notes || "",
    status: a?.status || "PENDING",
    veterinarianId: a?.veterinarianId?.toString() || "",
    ownerId: a?.ownerId?.toString() || "",
    petId: a?.petId?.toString() || "",
});

/**
 * Page: Edit Appointment
 * Loads existing appointment and allows partial update via PATCH.
 */
const AppointmentEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [appointment, setAppointment] = useState(
        location.state?.appointment ? normalizeToForm(location.state.appointment) : null
    );

    /**
     * Fetch appointment if not provided via navigation state
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!appointment) {
                    const data = await getAppointmentById(id);
                    setAppointment(normalizeToForm(data));
                }
            } catch (error) {
                console.error("Error al cargar turno:", error);
                enqueueSnackbar("Error al cargar el turno", { variant: "error" });
                navigate("/appointments");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, appointment, enqueueSnackbar, navigate]);

    /**
     * Handle PATCH update
     */
    const handleSubmit = async (formData) => {
        try {
            setSaving(true);

            const updates = Object.entries(formData).reduce((acc, [key, value]) => {
                if (value !== appointment[key]) acc[key] = value;
                return acc;
            }, {});

            if (Object.keys(updates).length === 0) {
                enqueueSnackbar("No hay cambios para guardar", { variant: "info" });
                return;
            }

            await patchAppointment(id, updates);
            enqueueSnackbar("Turno actualizado correctamente ✅", { variant: "success" });
            navigate(`/appointments/${id}`);
        } catch (error) {
            console.error("Error al actualizar turno:", error);
            enqueueSnackbar("Error al actualizar el turno", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    /**
     * Loading state
     */
    if (loading || !appointment) {
        return (
            <Stack alignItems="center" justifyContent="center" mt={4}>
                <CircularProgress />
            </Stack>
        );
    }

    /**
     * Custom cancel action — return to appointment detail
     */
    const handleCancel = () => {
        navigate(`/appointments/${id}`);
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Editar turno
            </Typography>
            <AppointmentForm
                initialValues={appointment}
                onSubmit={handleSubmit}
                saving={saving}
                onCancel={handleCancel} // ✅ se pasa esta prop al formulario
            />
        </Stack>
    );
};

export default AppointmentEdit;
