/**
 * Predefined style variants for consistent UI components.
 */
export const v = {
  page: {
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 3 },
  },
  cardSoft: {
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    borderRadius: 2,
    p: 2,
    backgroundColor: 'background.paper',
  },
  sectionTitle: {
    mb: 2,
    fontWeight: 800,
  },
  input: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 1.5,
    },
  },
  tableDense: {
    '& .MuiTableCell-root': { py: 1 },
  },
};
