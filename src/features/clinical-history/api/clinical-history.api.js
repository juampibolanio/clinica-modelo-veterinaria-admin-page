// Requiere que ya tengas un axiosInstance con baseURL y token
import axiosInstance from "../../../libs/axios";

const BASE = "/api/clinicalHistory";

// Helpers
const buildQuery = (params = {}) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") search.append(k, v);
  });
  return search.toString();
};

export const listClinicalHistory = async ({
  petId,
  veterinarianId,
  consultationType,
  fromDate,
  toDate,
  keyword,
  page = 0,
  size = 10,
  sortBy = "date",
  direction = "desc",
} = {}) => {
  const qs = buildQuery({
    petId,
    veterinarianId,
    consultationType,
    fromDate, // yyyy-MM-dd
    toDate, // yyyy-MM-dd
    keyword,
    page,
    size,
    sortBy,
    direction,
  });
  const { data } = await axiosInstance.get(`${BASE}?${qs}`);
  return data; // Page<ClinicalHistoryResponse>
};

export const getClinicalHistoryById = async (id) => {
  const { data } = await axiosInstance.get(`${BASE}/${id}`);
  return data; // ClinicalHistoryResponse
};

export const createClinicalHistory = async (payload) => {
  // payload shape debe seguir ClinicalHistoryRequest (consultationType, ... , petId, veterinarianId)
  const { data } = await axiosInstance.post(BASE, payload);
  return data;
};

export const patchClinicalHistory = async (id, updates) => {
  // updates: { campoParcial: valor } — solo lo que cambie
  const { data } = await axiosInstance.patch(`${BASE}/${id}`, updates);
  return data;
};

export const deleteClinicalHistory = async (id) => {
  await axiosInstance.delete(`${BASE}/${id}`);
};
