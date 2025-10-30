import api from "../../../libs/axios";

const BASE = "/api/products";

/**
 * Get products with pagination, sorting and filters.
 * Supports backend filtering by name, type and category.
 */
export const getProducts = async (params = {}) => {
  const {
    page = 0,
    size = 10,
    sortBy = "id",
    direction = "asc",
    name,
    type,
    category,
  } = params;

  const { data } = await api.get(BASE, {
    params: { page, size, sortBy, direction, name, type, category },
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
  const { id: _, categoryName, ...body } = payload;

  if (body.stock !== undefined) {
    body.stock = Number(body.stock);
  }

  const { data } = await api.patch(`${BASE}/${id}`, body);
  return data;
};

// Delete product by ID
export const deleteProduct = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
