import { useMemo, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppointmentForm from "../components/AppointmentForm";
import { createAppointment } from "../api/appointments.api";

const AppointmentCreate = () => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [searchParams] = useSearchParams();

    const initial = useMemo(() => {
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        return {
            date: date || undefined,
            time: time || undefined,
        };
    }, [searchParams]);

    const handleSubmit = async (payload) => {
        try {
            setSaving(true);
            await createAppointment(payload);
            enqueueSnackbar("Turno creado", { variant: "success" });
            navigate("/appointments");
        } catch {
            enqueueSnackbar("No se pudo crear el turno", { variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>Nuevo turno</Typography>
            <AppointmentForm initialValues={initial} onSubmit={handleSubmit} saving={saving} />
        </Stack>
    );
};

export default AppointmentCreate;
