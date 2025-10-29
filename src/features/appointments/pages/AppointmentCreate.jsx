import { useState, useMemo } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppointmentForm from "../components/AppointmentForm";
import { createAppointment } from "../api/appointments.api";

/**
 * Page: Create Appointment
 * Handles creation of new appointments, including pre-filled date/time.
 */
const AppointmentCreate = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);
    const [searchParams] = useSearchParams();

    // Preload date/time from URL if present
    const initialValues = useMemo(() => {
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        return {
            date: date || "",
            time: time || "",
            status: "PENDING",
        };
    }, [searchParams]);

    const handleSubmit = async (formData) => {
        try {
            setSaving(true);
            await createAppointment(formData);
            enqueueSnackbar("Turno creado correctamente ✅", { variant: "success" });
            navigate("/appointments");
        } catch (error) {
            console.error("Error al crear turno:", error);
            enqueueSnackbar("Error al crear el turno", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
                Nuevo turno
            </Typography>

            {saving && (
                <Stack alignItems="center" justifyContent="center" mt={2}>
                    <CircularProgress size={26} />
                </Stack>
            )}

            <AppointmentForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                saving={saving}
            />
        </Stack>
    );
};

export default AppointmentCreate;
