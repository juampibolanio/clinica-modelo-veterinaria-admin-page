import { Paper, Stack, Typography, Divider } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";

/**
 * DashboardLowStock component displays a list of products that are low in stock.
 * @param {Object} props - Component props.
 * @param {Array} props.lowStockProducts - Array of products with low stock.
 * @return {JSX.Element} The rendered component.
 */
const DashboardLowStock = ({ lowStockProducts }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <InventoryIcon color="error" />
            <Typography variant="h6" fontWeight={700}>
                Productos con poco stock
            </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {lowStockProducts.length === 0 ? (
            <Typography color="text.secondary">Todo el stock está en orden.</Typography>
        ) : (
            <Stack spacing={1}>
                {lowStockProducts.map((p) => (
                    <Stack
                        key={p.id}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                            bgcolor: "rgba(227,55,55,0.05)",
                            p: 1,
                            borderRadius: 1,
                        }}
                    >
                        <Typography>{p.name}</Typography>
                        <Typography color="error.main" fontWeight={700}>
                            {p.stock} u.
                        </Typography>
                    </Stack>
                ))}
            </Stack>
        )}
    </Paper>
);

export default DashboardLowStock;
