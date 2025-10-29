import axios from "../../../libs/axios";

/**
 * This module contains API calls related to pets.
 */

const BASE = "/api/pets";

/** Get all pets  */
export const getPets = async (filters = {}) => {
  const { data } = await axios.get(BASE, { params: filters });
  return data;
};

/** Get pet by ID */ 
export const getPetById = async (id) => {
  const { data } = await axios.get(`${BASE}/${id}`);
  return data;
};

/** Get all pets by owner ID */ 
export const getPetsByOwnerId = async (ownerId) => {
  const { data } = await axios.get(`/api/pets/owner/${ownerId}`);
  return data;
};


/** Create pet */
export const createPet = async (pet) => {
  const { data } = await axios.post(BASE, pet);
  return data;
};

/** Update pet */
export const patchPet = async (id, updates) => {
  const { data } = await axios.patch(`${BASE}/${id}`, updates);
  return data;
};

/** Delete Pet */
export const deletePet = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
