import { useState } from "react";
import { Box, Drawer, Toolbar, useMediaQuery } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { dashboardLayoutStyles } from "./styles/dashboardLayout.styles";


/**
 * Dashboard layout component that includes a sidebar and topbar.
 * @return {JSX.Element} The dashboard layout component.
 */
const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width:900px)");

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <Box sx={dashboardLayoutStyles.container}>
            {/* Sidebar */}
            <Box component="nav" sx={dashboardLayoutStyles.nav}>
                {/* Mobile drawer */}
                {!isDesktop && (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={dashboardLayoutStyles.drawerMobile}
                    >
                        <Sidebar onClose={handleDrawerToggle} />
                    </Drawer>
                )}

                {/* Desktop drawer */}
                {isDesktop && (
                    <Drawer
                        variant="permanent"
                        open
                        sx={dashboardLayoutStyles.drawerDesktop}
                    >
                        <Sidebar />
                    </Drawer>
                )}
            </Box>

            {/* Main content */}
            <Box component="main" sx={dashboardLayoutStyles.main}>
                <Topbar onMenuClick={handleDrawerToggle} />
                <Toolbar />
                <Box sx={dashboardLayoutStyles.contentWrapper}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;