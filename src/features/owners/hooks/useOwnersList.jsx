import { useState, useEffect, useRef, useCallback } from "react";
import { getOwners, deleteOwner } from "../api/owners.api";
import { useSnackbar } from "notistack";

/**
 * Custom hook to handle owners fetching, filtering, and deletion logic.
 */
export const useOwnersList = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState({
        name: "",
        surname: "",
        documentNumber: "",
    });
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const debounceRef = useRef(null);

    // Fetch owners from API
    const fetchOwners = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getOwners(search);
            setRows(data?.content || data || []);
        } catch {
            enqueueSnackbar("Error al cargar dueños", { variant: "error" });
        } finally {
            setLoading(false);
        }
    }, [enqueueSnackbar, search]);

    // Auto-fetch with debounce on filters
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(fetchOwners, 400);
        return () => clearTimeout(debounceRef.current);
    }, [fetchOwners]);

    // Handle deletion with confirmation
    const handleConfirmDelete = async () => {
        if (!selectedOwner) return;
        try {
            await deleteOwner(selectedOwner.id);
            enqueueSnackbar("Dueño eliminado correctamente", { variant: "success" });
            fetchOwners();
        } catch {
            enqueueSnackbar("Error al eliminar", { variant: "error" });
        } finally {
            setConfirmOpen(false);
            setSelectedOwner(null);
        }
    };

    return {
        rows,
        loading,
        search,
        setSearch,
        fetchOwners,
        confirmOpen,
        setConfirmOpen,
        selectedOwner,
        setSelectedOwner,
        handleConfirmDelete,
    };
};
