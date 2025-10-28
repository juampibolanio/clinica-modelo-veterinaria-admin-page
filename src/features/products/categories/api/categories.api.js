import api from "../../../../libs/axios";

const BASE = "/api/productCategories";

export const getCategories = async (params = {}) => {
  const { data } = await api.get(BASE, { params });
  return data;
};

export const getCategoryById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post(BASE, payload);
  return data;
};

export const patchCategory = async (id, payload) => {
  // Evitamos enviar el id al backend
  const { id: _, ...body } = payload;
  const { data } = await api.patch(`${BASE}/${id}`, body);
  return data;
};


export const deleteCategory = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
