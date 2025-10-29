import { useState, useCallback, useEffect, useRef } from "react";
import { useSnackbar } from "notistack";
import { getAllUsers, deleteUser } from "../api/users.api";

/**
 * Custom hook that handles fetching, searching and deleting users
 */
export const useUsersData = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const debounceRef = useRef(null);

  // Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers(keyword);
      setRows(data || []);
    } catch {
      enqueueSnackbar("Error al cargar usuarios", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, keyword]);

  // Handle search with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchUsers, 400);
    return () => clearTimeout(debounceRef.current);
  }, [keyword, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Delete user
  const handleDeleteUser = useCallback(
    async (id) => {
      try {
        await deleteUser(id);
        enqueueSnackbar("Usuario eliminado correctamente", {
          variant: "success",
        });
        fetchUsers();
      } catch {
        enqueueSnackbar("Error al eliminar usuario", { variant: "error" });
      }
    },
    [enqueueSnackbar, fetchUsers]
  );

  return {
    rows,
    loading,
    keyword,
    setKeyword,
    fetchUsers,
    handleDeleteUser,
  };
};
