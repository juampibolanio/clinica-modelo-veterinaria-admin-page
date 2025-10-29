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

// 6️⃣ Mascotas por especie
export const getPetsBySpecies = async () => {
  const { data } = await axios.get(`${BASE}/pets-by-species`);
  // Backend → species, count
  return data.map((item) => ({
    species: item.species,
    count: item.count,
  }));
};

// 7️⃣ Mascotas por género
export const getPetsByGender = async () => {
  const { data } = await axios.get(`${BASE}/pets-by-gender`);
  return data.map((item) => ({
    gender: item.gender === "MALE" ? "Macho" : "Hembra",
    count: item.count,
  }));
};

// 8️⃣ Turnos por mes o semana
export const getAppointmentsByPeriod = async (type = "month", year) => {
  const { data } = await axios.get(`${BASE}/appointments-by-period`, {
    params: { type, year },
  });
  return data.map((item) => ({
    period: item.period,
    count: item.totalAppointments,
  }));
};

// 9️⃣ Promedio de edad de mascotas
export const getAveragePetAge = async () => {
  const { data } = await axios.get(`${BASE}/average-pet-age`);
  return data.averageAge;
};

// 🔟 Diagnósticos más frecuentes por especie
export const getTopDiagnosesBySpecies = async (limit = 10) => {
  const { data } = await axios.get(`${BASE}/top-diagnoses-by-species`, {
    params: { limit },
  });

  // Backend → species, diagnosis, count
  return data.map((item) => ({
    species: item.species,
    diagnosis: item.diagnosis,
    count: item.count,
  }));
};