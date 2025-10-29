/**
* SectionList: componente reutilizable para renderizar listas dentro del detalle
*/
export const SectionList = ({
    icon,
    title,
    items,
    loading,
    emptyText,
    createLabel,
    onCreate,
    renderItem,
}) => (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            {icon}
            <Typography variant="h6" fontWeight={700}>
                {title}
            </Typography>
            {onCreate && (
                <Button variant="contained" sx={{ ml: "auto" }} onClick={onCreate}>
                    {createLabel}
                </Button>
            )}
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {loading ? (
            <CircularProgress />
        ) : items.length === 0 ? (
            <Typography color="text.secondary">{emptyText}</Typography>
        ) : (
            items.map((item) => (
                <Box key={item.id} sx={{ py: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {renderItem(item)}
                    </Stack>
                    <Divider sx={{ mt: 1 }} />
                </Box>
            ))
        )}
    </Paper>
);