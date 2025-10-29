import api from "../../../libs/axios";

/**
 * Fetch dashboard statistics from the API.
 * @returns {Promise<Object>} Dashboard statistics data.
 */
export const getDashboardStats = async () => {
  const { data } = await api.get("api/stats/dashboard");
  return data;
};
