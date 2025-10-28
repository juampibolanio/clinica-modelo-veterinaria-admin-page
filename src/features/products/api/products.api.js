// src/modules/products/api/products.api.js
import api from "../../../libs/axios";

const BASE = "/api/products";

// Obtener productos
export const getProducts = async (params = {}) => {
  const { data } = await api.get(BASE, { params });
  return data;
};

// Obtener producto por ID
export const getProductById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

// Crear producto
export const createProduct = async (payload) => {
  const { data } = await api.post(BASE, payload);
  return data;
};

// Editar producto (PATCH)
export const patchProduct = async (id, payload) => {
  // Excluimos campos que el backend no admite
  const { id: _, categoryName, ...body } = payload;

  // Aseguramos que 'stock' sea número (por si llega como string)
  if (body.stock !== undefined) {
    body.stock = Number(body.stock);
  }

  const { data } = await api.patch(`/api/products/${id}`, body);
  return data;
};

// Eliminar producto
export const deleteProduct = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
