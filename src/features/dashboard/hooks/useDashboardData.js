import { useState, useEffect } from "react";
import {
  fetchDashboardData,
  fetchWeather,
} from "../api/dashboard.service";
import { useSnackbar } from "notistack";

/**
 * 
 * Custom hook to fetch and manage dashboard data.
 * @param {string} userId - The ID of the user for whom to fetch dashboard data.
 * @return {Object} An object containing dashboard data and loading state.
 */
export const useDashboardData = (userId) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    appointments: [],
    weeklyAppointments: [],
    lowStockProducts: [],
    stats: null,
    weather: null,
  });

  useEffect(() => {
    const load = async () => {
      if (!userId) return;
      try {
        const res = await fetchDashboardData(userId);
        const weather = await fetchWeather();
        setData({ ...res, weather });
      } catch {
        enqueueSnackbar("Error al cargar datos del dashboard", {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [enqueueSnackbar, userId]);

  return { ...data, loading };
};
