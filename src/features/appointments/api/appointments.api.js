import axios from "../../../libs/axios";

const BASE = "/api/appointments";

// Helpers para query
const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

export const listAppointments = async (params = {}) => {
  const { data } = await axios.get(BASE, { params: clean(params) });
  return data; // Page<AppointmentResponse>
};

export const getAppointmentById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const createAppointment = async (payload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

export const updateAppointment = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

export const patchAppointment = async (id, updates) => {
  const { data } = await axios.patch(`${BASE}/${id}`, updates);
  return data;
};

export const deleteAppointment = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
