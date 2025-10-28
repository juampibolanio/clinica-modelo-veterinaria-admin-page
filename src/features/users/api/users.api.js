import axios from "../../../libs/axios";

const BASE = "/api/users";

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

// Obtener usuario por ID
export const getUserById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

// Crear usuario nuevo
export const createUser = async (data) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

// Actualizar usuario completo (PUT)
export const updateUser = async (id, data) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

// Actualización parcial (PATCH)
export const patchUser = async (id, data) => {
  const res = await axios.patch(`${BASE}/${id}`, data);
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
