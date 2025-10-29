import api from "../../../libs/axios";

/**
 * This module contains API calls related to products.
 */

const BASE = "/api/products";

// Get products with pagination and sorting
export const getProducts = async (params = {}) => {
  // Default values
  const { page = 0, size = 10, sortBy = "id", direction = "asc" } = params;

  const { data } = await api.get(BASE, {
    params: { page, size, sortBy, direction },
  });

  return data;
};

// Get product by ID
export const getProductById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

// Create new product
export const createProduct = async (payload) => {
  const { data } = await api.post(BASE, payload);
  return data;
};

// Update existing product
export const patchProduct = async (id, payload) => {
  // Exclude 'id' and 'categoryName' from payload
  const { id: _, categoryName, ...body } = payload;

  // Convert 'price' and 'stock' to numbers if they exist
  if (body.stock !== undefined) {
    body.stock = Number(body.stock);
  }

  const { data } = await api.patch(`${BASE}/${id}`,  body);
  return data;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
