import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import { getAppointmentById, patchAppointment } from "../api/appointments.api";
import dayjs from "dayjs";
import { appointmentPageStyles } from "../styles/appointmentPage.styles";

/**
 * Normaliza datos del backend para el formulario
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
 * Página: Editar turno existente
 */
const AppointmentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [appointment, setAppointment] = useState(
    location.state?.appointment
      ? normalizeToForm(location.state.appointment)
      : null
  );

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
      enqueueSnackbar("Turno actualizado correctamente ✅", {
        variant: "success",
      });
      navigate(`/appointments/${id}`);
    } catch (error) {
      console.error("Error al actualizar turno:", error);
      enqueueSnackbar("Error al actualizar el turno", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !appointment) {
    return (
      <Stack sx={appointmentPageStyles.loaderBox}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Stack sx={appointmentPageStyles.pageContainer}>
      <Typography sx={appointmentPageStyles.headerTitle}>
        Editar turno
      </Typography>

      <AppointmentForm
        initialValues={appointment}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </Stack>
  );
};

export default AppointmentEdit;
