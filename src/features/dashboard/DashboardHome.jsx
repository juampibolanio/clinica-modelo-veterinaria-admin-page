import { Stack, CircularProgress, Box } from "@mui/material";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useDashboardData } from "./hooks/useDashboardData";
import DashboardGreeting from "./components/DashboardGreeting";
import DashboardTodayAppointments from "./components/DashboardTodayAppointments";
import DashboardWeeklyAppointments from "./components/DashboardWeeklyAppointments";
import DashboardLowStock from "./components/DashboardLowStock";
import DashboardMonthlySummary from "./components/DashboardMonthlySummary";

/**
 * DashboardHome component serves as the main dashboard view.
 * @return {JSX.Element} The rendered dashboard home component.
 */
const DashboardHome = () => {
    const { user } = useAuth();
    const {
        appointments,
        weeklyAppointments,
        stats,
        weather,
        loading,
    } = useDashboardData(user?.id);

    if (loading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
                <CircularProgress />
            </Box>
        );

    return (
        <Stack spacing={3}>
            <DashboardGreeting user={user} weather={weather} />
            <DashboardTodayAppointments appointments={appointments} />
            <DashboardWeeklyAppointments weeklyAppointments={weeklyAppointments} />
            <DashboardMonthlySummary stats={stats} />
        </Stack>
    );
};

export default DashboardHome;
