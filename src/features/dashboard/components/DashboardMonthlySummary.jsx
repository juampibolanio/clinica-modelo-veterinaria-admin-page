import { Paper, Stack, Typography, Divider, Grid, Box } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";

/**
 * 
 * DashboardMonthlySummary component displays a summary of monthly statistics.
 * @param {Object} props - Component props.
 * @param {Object} props.stats - Monthly statistics data.
 *  @return {JSX.Element} The rendered component.
 */
const DashboardMonthlySummary = ({ stats }) => (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <AssessmentIcon color="secondary" />
            <Typography variant="h6" fontWeight={700}>
                Resumen del mes
            </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
            {[
                { label: "Turnos atendidos", value: stats?.appointmentsThisMonth || 0 },
                { label: "Vacunas aplicadas", value: stats?.vaccinesApplied || 0 },
                { label: "Mascotas atendidas", value: stats?.totalPets || 0 },
            ].map((item, i) => (
                <Grid item xs={12} sm={4} key={i}>
                    <Box textAlign="center">
                        <Typography variant="h5" fontWeight={700}>
                            {item.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {item.label}
                        </Typography>
                    </Box>
                </Grid>
            ))}
        </Grid>
    </Paper>
);

export default DashboardMonthlySummary;
