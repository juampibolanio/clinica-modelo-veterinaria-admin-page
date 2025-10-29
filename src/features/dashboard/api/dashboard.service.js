import dayjs from "dayjs";
import { listAppointments } from "../../../features/appointments/api/appointments.api";
import { getProducts } from "../../../features/products/api/products.api";
import { getDashboardStats } from "./dashboard.api";

/**
 * Load data for the dashboard.
 * @param {string} userId - ID of the current user.
 * @returns {Promise<Object>} Dashboard data including appointments, products, and stats.
 */
export const fetchDashboardData = async (userId) => {
  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");
  const endOfWeek = today.endOf("week").add(1, "day");

  const [appointmentsRes, weeklyRes, productsRes, statsRes] = await Promise.all([
    listAppointments({
      veterinarianId: userId,
      fromDate: today.format("YYYY-MM-DD"),
      toDate: today.format("YYYY-MM-DD"),
      sortBy: "time",
      direction: "asc",
    }),
    listAppointments({
      veterinarianId: userId,
      fromDate: startOfWeek.format("YYYY-MM-DD"),
      toDate: endOfWeek.format("YYYY-MM-DD"),
    }),
    getProducts(),
    getDashboardStats(),
  ]);

  const appointments = appointmentsRes.content || appointmentsRes;
  const weeklyAppointments = weeklyRes.content || weeklyRes;
  const allProducts = productsRes.content || productsRes;
  const lowStockProducts = allProducts.filter((p) => p.stock < 5);

  return { appointments, weeklyAppointments, lowStockProducts, stats: statsRes };
};

/**
 * Get current weather data from external API.
 * @returns {Promise<Object|null>} Current weather data or null if failed.
 */
export const fetchWeather = async () => {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-27.45&longitude=-58.98&current_weather=true&timezone=auto"
    );
    const data = await res.json();
    return data?.current_weather || null;
  } catch {
    return null;
  }
};
