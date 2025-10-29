import { useState, useEffect, useCallback } from "react";
import { listAppointments, deleteAppointment } from "../api/appointments.api";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import { getAllUsers } from "../../users/api/users.api";

/**
 * Hook to handle appointment data fetching, filtering and deletion
 */
export const useAppointmentsData = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [filters, setFilters] = useState({
    veterinarianId: "",
    status: "",
    fromDate: "",
    toDate: "",
    page: 0,
    size: 100,
    sortBy: "date",
    direction: "asc",
  });

  const [appointments, setAppointments] = useState([]);
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch appointments
  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listAppointments(filters);
      setAppointments(data?.content || []);
    } catch {
      enqueueSnackbar("Error al cargar turnos", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [filters, enqueueSnackbar]);

  // Fetch veterinarians once
  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsers();
        setVets(users);
      } catch {
        enqueueSnackbar("Error al cargar veterinarios", { variant: "warning" });
      }
    })();
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Delete appointment
  const handleDeleteAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      enqueueSnackbar("Turno eliminado correctamente", { variant: "success" });
      fetchAppointments();
    } catch {
      enqueueSnackbar("Error al eliminar turno", { variant: "error" });
    }
  };

  // Derived data
  const todayStr = dayjs().format("YYYY-MM-DD");
  const tomorrowStr = dayjs().add(1, "day").format("YYYY-MM-DD");
  const todayList = appointments.filter((a) => a.date === todayStr);
  const tomorrowList = appointments.filter((a) => a.date === tomorrowStr);

  return {
    filters,
    setFilters,
    appointments,
    vets,
    todayList,
    tomorrowList,
    loading,
    fetchAppointments,
    handleDeleteAppointment,
  };
};
