import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { getCategories } from "../../products/categories/api/categories.api";
import { PRODUCT_TYPES } from "../constants/product-types";

/**
 * ProductFilters
 * - Carga categorías desde el backend.
 * - Tipos desde constante local.
 * - Incluye debounce en la búsqueda (500ms).
 */
const ProductFilters = ({ onApply }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // ==============================
    // Fetch categories from backend
    // ==============================
    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await getCategories({ size: 100 }); // traer todas
            setCategories(data?.content || data || []);
        } catch (err) {
            console.error(err);
            enqueueSnackbar("Error al cargar las categorías", { variant: "error" });
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // ==============================
    // Debounce for name search
    // ==============================
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            onApply({
                name: searchTerm || undefined,
                type: selectedType || undefined,
                category: selectedCategory || undefined,
            });
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, selectedType, selectedCategory]);

    // ==============================
    // Reset filters
    // ==============================
    const handleReset = () => {
        setSearchTerm("");
        setSelectedType("");
        setSelectedCategory("");
        onApply({});
    };

    // ==============================
    // Render
    // ==============================
    return (
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            flexWrap="wrap"
            alignItems="center"
        >
            {/* Buscar por nombre */}
            <TextField
                label="Buscar por nombre"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 220 }}
            />

            {/* Tipo */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Tipo</InputLabel>
                <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    label="Tipo"
                >
                    <MenuItem value="">Todos</MenuItem>
                    {PRODUCT_TYPES.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Categoría */}
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Categoría"
                    disabled={loadingCategories}
                >
                    <MenuItem value="">Todas</MenuItem>
                    {loadingCategories ? (
                        <MenuItem disabled>
                            <CircularProgress size={20} />
                            &nbsp;Cargando...
                        </MenuItem>
                    ) : (
                        categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.name}>
                                {cat.name}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>

            <Button variant="outlined" color="secondary" onClick={handleReset}>
                Limpiar
            </Button>
        </Stack>
    );
};

export default ProductFilters;
