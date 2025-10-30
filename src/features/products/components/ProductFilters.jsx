import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { getCategories } from "../../products/categories/api/categories.api";
import { PRODUCT_TYPES } from "../constants/product-types";
import { productFiltersStyles } from "../styles/productFilters.styles";

const ProductFilters = ({ onApply }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await getCategories({ size: 100 });
            setCategories(data?.content || data || []);
        } catch (err) {
            enqueueSnackbar("Error al cargar las categorías", { variant: "error" });
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            onApply({
                name: searchTerm || undefined,
                type: selectedType || undefined,
                category: selectedCategory || undefined,
            });
        }, 500);
        return () => clearTimeout(delay);
    }, [searchTerm, selectedType, selectedCategory]);

    const handleReset = () => {
        setSearchTerm("");
        setSelectedType("");
        setSelectedCategory("");
        onApply({});
    };

    return (
        <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="flex-start"
            sx={productFiltersStyles.container}
        >
            <TextField
                label="Buscar por nombre"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ej: Alimento para perros"
                sx={productFiltersStyles.searchField}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "primary.main" }} />
                        </InputAdornment>
                    ),
                }}
            />

            <FormControl size="small" sx={productFiltersStyles.selectControl}>
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

            <FormControl size="small" sx={productFiltersStyles.selectControl}>
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

            <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
                sx={productFiltersStyles.resetButton}
            >
                Limpiar
            </Button>
        </Stack>
    );
};

export default ProductFilters;
