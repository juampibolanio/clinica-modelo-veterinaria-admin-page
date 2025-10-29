import axios from "../../../libs/axios";

/**
 * This module contains API calls related to user management.
 */

const BASE = "/api/users";

// Get all users
export const getAllUsers = async () => {
  const res = await axios.get(BASE);
  return res.data;
};

// Get users by ID
export const getUserById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

// Create a new user
export const createUser = async (data) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

// Update user completely (PUT)
export const updateUser = async (id, data) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

// Partial update (PATCH)
export const patchUser = async (id, data) => {
  const res = await axios.patch(`${BASE}/${id}`, data);
  return res.data;
};

// Delete user
export const deleteUser = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
