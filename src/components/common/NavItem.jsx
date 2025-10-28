import { useState, useEffect } from "react";
import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    List,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

const NavItem = ({ label, icon, path, children, onClick, color }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Activo si coincide la ruta o una subruta
    const active =
        path && (location.pathname === path || location.pathname.startsWith(`${path}/`));

    // Estado para submenú desplegable
    const [open, setOpen] = useState(false);

    // Abre el submenú automáticamente si una ruta hija está activa
    useEffect(() => {
        if (children?.some((c) => location.pathname.startsWith(c.path))) {
            setOpen(true);
        }
    }, [location.pathname, children]);

    // Si tiene hijos, el click solo expande, no navega
    const handleClick = () => {
        if (children) setOpen((prev) => !prev);
        else {
            navigate(path);
            onClick?.();
        }
    };

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    color: active ? "primary.main" : "text.primary",
                    bgcolor: active ? "rgba(55,129,227,0.1)" : "transparent",
                    borderRadius: 2,
                    mx: 1,
                    mb: 0.5,
                    "&:hover": { bgcolor: "rgba(55,129,227,0.08)" },
                }}
            >
                {icon && (
                    <ListItemIcon
                        sx={{
                            color: active ? "primary.main" : "text.secondary",
                            minWidth: 40,
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                )}
                <ListItemText primary={label} />
                {children && (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {/* Submenú */}
            {children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding>
                        {children.map((sub) => {
                            const subActive = location.pathname.startsWith(sub.path);
                            return (
                                <ListItemButton
                                    key={sub.path}
                                    component={NavLink}
                                    to={sub.path}
                                    onClick={onClick}
                                    sx={{
                                        pl: 7,
                                        py: 0.7,
                                        color: subActive ? "primary.main" : "text.secondary",
                                        bgcolor: subActive ? "rgba(55,129,227,0.08)" : "transparent",
                                        borderRadius: 1,
                                        mx: 1,
                                        mb: 0.4,
                                        "&:hover": { bgcolor: "rgba(55,129,227,0.1)" },
                                    }}
                                >
                                    <ListItemText primary={sub.label} />
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Collapse>
            )}
        </>
    );
};

export default NavItem;
