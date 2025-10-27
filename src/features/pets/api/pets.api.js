import axios from "../../../libs/axios";

const BASE = "/api/pets";

/** 🔹 Obtener todas las mascotas (paginadas + filtros opcionales) */
export const getPets = async (filters = {}) => {
  const { data } = await axios.get(BASE, { params: filters });
  return data;
};

/** 🔹 Obtener mascota por ID */
export const getPetById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

export const getPetsByOwnerId = async (ownerId) => {
  const { data } = await axios.get(`/api/pets/owner/${ownerId}`);
  return data;
};


/** 🔹 Crear nueva mascota */
export const createPet = async (pet) => {
  const { data } = await axios.post(BASE, pet);
  return data;
};

/** 🔹 Actualizar mascota (PATCH) */
export const patchPet = async (id, updates) => {
  const { data } = await axios.patch(`${BASE}/${id}`, updates);
  return data;
};

/** 🔹 Eliminar mascota */
export const deletePet = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
