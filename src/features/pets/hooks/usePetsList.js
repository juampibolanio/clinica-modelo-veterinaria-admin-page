import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { getPets, deletePet } from "../api/pets.api";

export const usePetsList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
  });
  const debounceRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const result = await getPets(filters);
      setRows(result.content || []);
    } catch {
      enqueueSnackbar("Error al cargar mascotas", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchPets, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters]);

  const handleDeleteClick = (pet) => {
    setSelectedPet(pet);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPet) return;
    try {
      await deletePet(selectedPet.id);
      enqueueSnackbar("Mascota eliminada correctamente", {
        variant: "success",
      });
      fetchPets();
    } catch {
      enqueueSnackbar("Error al eliminar mascota", { variant: "error" });
    } finally {
      setConfirmOpen(false);
    }
  };

  return {
    rows,
    loading,
    filters,
    setFilters,
    confirmOpen,
    setConfirmOpen,
    selectedPet,
    setSelectedPet,
    fetchPets,
    handleDeleteClick,
    handleConfirmDelete,
  };
};
