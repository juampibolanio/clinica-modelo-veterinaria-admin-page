import { Stack, Typography, CircularProgress } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useState, useMemo } from "react";
import AppointmentForm from "../components/AppointmentForm";
import { createAppointment } from "../api/appointments.api";
import { appointmentPageStyles } from "../styles/appointmentPage.styles";


/**
 * Página: Crear nuevo turno
 */
const AppointmentCreate = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const [searchParams] = useSearchParams();

  // Cargar fecha y hora desde la URL si existen
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
    <Stack sx={appointmentPageStyles.pageContainer}>
      <Typography sx={appointmentPageStyles.headerTitle}>
        Registrar nuevo turno
      </Typography>

      {saving && (
        <Stack sx={appointmentPageStyles.loaderBox}>
          <CircularProgress size={28} />
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
