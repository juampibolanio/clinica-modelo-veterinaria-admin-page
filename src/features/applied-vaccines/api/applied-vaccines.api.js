import axios from "../../../libs/axios";

/**
 * This module provides API functions for managing applied vaccines.
 * It includes functions to list, retrieve, create, update, and delete applied vaccine records.
 */

const BASE = "/api/appliedVaccines";

// List all applied vaccines with optional query parameters
export const listAppliedVaccines = async (params = {}) => {
  const res = await axios.get(BASE, { params });
  return res.data;
};

// Get a specific applied vaccine by ID
export const getAppliedVaccineById = async (id) => {
  const res = await axios.get(`${BASE}/${id}`);
  return res.data;
};

// Create a new applied vaccine record
export const createAppliedVaccine = async (data) => {
  const res = await axios.post(BASE, data);
  return res.data;
};

// Update an existing applied vaccine record by ID
export const updateAppliedVaccine = async (id, data) => {
  const res = await axios.put(`${BASE}/${id}`, data);
  return res.data;
};

// Partially update an existing applied vaccine record by ID
export const patchAppliedVaccine = async (id, data) => {
  const res = await axios.patch(`${BASE}/${id}`, data);
  return res.data;
};

// Delete an applied vaccine record by ID
export const deleteAppliedVaccine = async (id) => {
  await axios.delete(`${BASE}/${id}`);
};
