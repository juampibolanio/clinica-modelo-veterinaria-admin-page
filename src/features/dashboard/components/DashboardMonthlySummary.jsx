import { Paper, Stack, Typography, Divider, Grid, Box, useMediaQuery, useTheme } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

/**
 * DashboardMonthlySummary component displays a summary of monthly statistics.
 * @param {Object} props - Component props.
 * @param {Object} props.stats - Monthly statistics data.
 * @return {JSX.Element} The rendered component.
 */
const DashboardMonthlySummary = ({ stats }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const summaryItems = [
        { label: "Turnos atendidos", value: stats?.appointmentsThisMonth || 0 },
        { label: "Vacunas aplicadas", value: stats?.vaccinesApplied || 0 },
        { label: "Mascotas atendidas", value: stats?.totalPets || 0 },
    ];

    return (
        <Paper
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                bgcolor: "#fff",
                boxShadow: "0 2px 8px rgba(55,129,227,0.08)",
            }}
        >
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mb={1.5}
                justifyContent={isMobile ? "center" : "flex-start"}
            >
                <AssessmentIcon color="secondary" sx={{ fontSize: isMobile ? 22 : 26 }} />
                <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    fontWeight={700}
                    textAlign={isMobile ? "center" : "left"}
                >
                    Resumen del mes
                </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* Grid layout */}
            <Grid
                container
                spacing={isMobile ? 3 : 2}
                justifyContent="center"
                alignItems="stretch"
            >
                {summaryItems.map((item, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Box
                            textAlign="center"
                            sx={{
                                p: { xs: 1, sm: 2 },
                                borderRadius: 2,
                                transition: "all 0.25s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(55,129,227,0.05)",
                                    transform: "translateY(-3px)",
                                },
                            }}
                        >
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                fontWeight={800}
                                color="primary.main"
                            >
                                {item.value}
                            </Typography>
                            <Typography
                                variant={isMobile ? "body2" : "body1"}
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {item.label}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default DashboardMonthlySummary;
