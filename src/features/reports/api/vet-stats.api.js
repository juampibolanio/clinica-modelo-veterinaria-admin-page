import axios from "../../../libs/axios";

const BASE = "/api/stats";

// 1️⃣ Turnos por veterinario
export const getAppointmentsPerVet = async (limit = 5) => {
  const { data } = await axios.get(`${BASE}/appointments-per-vet`, {
    params: { limit },
  });
  // Backend → veterinarianName, totalAppointments
  return data.map((item) => ({
    vetName: item.veterinarianName,
    count: item.totalAppointments,
  }));
};

// 2️⃣ Vacunas aplicadas por mes
export const getVaccinesPerMonth = async (year) => {
  const { data } = await axios.get(`${BASE}/vaccines-per-month`, {
    params: { year },
  });
  // Backend → month (numérico), totalApplied
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  return data.map((item) => ({
    month: months[item.month - 1],
    count: item.totalApplied,
  }));
};

// 3️⃣ Productos más usados
export const getTopProducts = async (limit = 5) => {
  const { data } = await axios.get(`${BASE}/top-products`, {
    params: { limit },
  });
  return data.map((item) => ({
    productName: item.productName,
    count: item.timesUsed,
  }));
};

// 4️⃣ Mascotas por dueño
export const getPetsPerOwner = async (limit = 10) => {
  const { data } = await axios.get(`${BASE}/pets-per-owner`, {
    params: { limit },
  });
  return data.map((item) => ({
    ownerName: item.ownerFullName,
    count: item.totalPets,
  }));
};

// 5️⃣ Diagnósticos más frecuentes
export const getTopDiagnoses = async (limit = 5) => {
  const { data } = await axios.get(`${BASE}/top-diagnoses`, {
    params: { limit },
  });
  return data.map((item) => ({
    diagnosis: item.diagnosis,
    count: item.count,
  }));
};
