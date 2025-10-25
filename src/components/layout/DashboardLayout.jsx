import { useState } from 'react';
import { Box, Drawer, IconButton, Toolbar, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width:900px)');

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Sidebar */}
            <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
                {/* Modo móvil */}
                {!isDesktop && (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': { width: drawerWidth, bgcolor: '#fff' },
                        }}
                    >
                        <Sidebar onClose={handleDrawerToggle} />
                    </Drawer>
                )}

                {/* Modo escritorio */}
                {isDesktop && (
                    <Drawer
                        variant="permanent"
                        open
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                bgcolor: '#fff',
                                borderRight: '1px solid #E0E0E0',
                            },
                        }}
                    >
                        <Sidebar />
                    </Drawer>
                )}
            </Box>

            {/* Contenido principal */}
            <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
                <Topbar onMenuClick={handleDrawerToggle} />
                <Toolbar />
                <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
