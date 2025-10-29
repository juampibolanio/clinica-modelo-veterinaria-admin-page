import axios from "../../../libs/axios";

/**
 * This module contains API functions for managing appointments.
 */

const BASE = "/api/appointments";

// Utility function to clean query parameters
const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

// List appointments with optional filters
export const listAppointments = async (params = {}) => {
  const { data } = await axios.get(BASE, { params: clean(params) });
  return data;
};

// Get appointment by ID
export const getAppointmentById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

// Create a new appointment
export const createAppointment = async (payload) => {
  const { data } = await axios.post(BASE, payload);
  return data;
};

// Update an existing appointment
export const updateAppointment = async (id, payload) => {
  const { data } = await axios.put(`${BASE}/${id}`, payload);
  return data;
};

// Partially update an appointment
export const patchAppointment = async (id, updates) => {
  const { data } = await axios.patch(`${BASE}/${id}`, updates);
  return data;
};

// Delete an appointment
export const deleteAppointment = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
