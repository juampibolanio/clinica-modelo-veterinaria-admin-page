import axios from "../../../libs/axios";

const BASE = "/api/appliedVaccines";

// Listado con filtros y paginación
export const listAppliedVaccines = async (params = {}) => {
  const res = await axios.get(BASE, { params });
  return res.data;
};

// Obtener por ID
export const getAppliedVaccineById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

// Crear nueva vacuna aplicada
export const createAppliedVaccine = async (data) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

// Actualizar completamente
export const updateAppliedVaccine = async (id, data) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

// Actualizar parcialmente (PATCH)
export const patchAppliedVaccine = async (id, data) => {
  const res = await axios.patch(`${BASE}/${id}`, data);
  return res.data;
};

// Eliminar
export const deleteAppliedVaccine = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
