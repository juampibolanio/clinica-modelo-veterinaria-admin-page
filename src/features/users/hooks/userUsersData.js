import { useState, useCallback, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { getAllUsers, deleteUser } from "../api/users.api";

/**
 * Maneja listado, filtros y eliminación de usuarios
 */
export const useUsersData = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });

  // Estado del diálogo de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const debounceRef = useRef(null);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const keyword = [filters.name, filters.email, filters.role]
        .filter(Boolean)
        .join(" ");

      const data = await getAllUsers(keyword);
      const list = Array.isArray(data) ? data : data?.content || [];
      setRows(list);
    } catch (err) {
      enqueueSnackbar("Error al cargar usuarios", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, filters]);

  // Debounce para filtros
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchUsers, 400);
    return () => clearTimeout(debounceRef.current);
  }, [filters, fetchUsers]);

  // Carga inicial
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Eliminar usuario
  const handleConfirmDelete = useCallback(async () => {
    if (!selectedUser?.id) return;
    try {
      await deleteUser(selectedUser.id);
      enqueueSnackbar("Usuario eliminado correctamente", {
        variant: "success",
      });
      fetchUsers();
    } catch {
      enqueueSnackbar("Error al eliminar usuario", { variant: "error" });
    } finally {
      setConfirmOpen(false);
    }
  }, [enqueueSnackbar, fetchUsers, selectedUser]);

  return {
    rows,
    loading,
    filters,
    setFilters,
    confirmOpen,
    setConfirmOpen,
    selectedUser,
    setSelectedUser,
    handleConfirmDelete,
    fetchUsers,
  };
};
