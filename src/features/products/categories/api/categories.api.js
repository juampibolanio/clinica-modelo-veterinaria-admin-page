import api from "../../../../libs/axios";

/**
 * This section defines the API calls for managing product categories.
 */
 

const BASE = "/api/productCategories";

// Fetch all categories with optional query parameters
export const getCategories = async (params = {}) => {
  const { data } = await api.get(BASE, { params });
  return data;
};

// Fetch a single category by its ID
export const getCategoryById = async (id) => {
  const { data } = await api.get(`${BASE}/${id}`);
  return data;
};

// Create a new category
export const createCategory = async (payload) => {
  const { data } = await api.post(BASE, payload);
  return data;
};

// Update an existing category by its ID
export const patchCategory = async (id, payload) => {
  const { id: _, ...body } = payload;
  const { data } = await api.patch(`${BASE}/${id}`, body);
  return data;
};

// Delete a category by its ID
export const deleteCategory = async (id) => {
  await api.delete(`${BASE}/${id}`);
};
