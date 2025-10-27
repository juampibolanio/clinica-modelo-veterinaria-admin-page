import axios from "../../../libs/axios";

const BASE = "/api/owners";

/**
 * Get owners list with optional filters and pagination
 */
export const getOwners = async ({
  name = "",
  surname = "",
  documentNumber = "",
  page = 0,
  size = 10,
  sortBy = "id",
  direction = "asc",
} = {}) => {
  const { data } = await axios.get(BASE, {
    params: { name, surname, documentNumber, page, size, sortBy, direction },
  });
  return data; 
};

/**
 * Get owner by ID
 */
export const getOwnerById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

/**
 * Create a new owner
 */
export const createOwner = async (owner) => {
  const { data } = await axios.post(BASE, owner);
  return data;
};

/**
 * Update an existing owner
 */
export const patchOwner = async (id, partialOwner) => {
  const { data } = await axios.patch(`${BASE}/${id}`, partialOwner);
  return data;
};

/**
 * Delete an owner by id
 */
export const deleteOwner = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
