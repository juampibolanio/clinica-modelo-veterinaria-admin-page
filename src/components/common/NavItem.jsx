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

/**
 * * This component represents a navigation item that can function as a link or a collapsible menu with sub-items.
 * @param {string} label - The text label for the navigation item.
 * @param {JSX.Element} icon - The icon to display alongside the label.
 * @param {string} path - The navigation path for the item.
 * @param {Array<{ label: string, path: string }>} children - An array of sub-items for the collapsible menu.
 * @param {() => void} onClick - The callback function to be executed when the item is clicked.
 * @param {string} color - The color of the navigation item.
 */
// eslint-disable-next-line no-unused-vars
const NavItem = ({ label, icon, path, children, onClick, color }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const active =
        path && (location.pathname === path || location.pathname.startsWith(`${path}/`));

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (children?.some((c) => location.pathname.startsWith(c.path))) {
            setOpen(true);
        }
    }, [location.pathname, children]);

    const handleClick = () => {
        if (children) setOpen((prev) => !prev);
        else {
            navigate(path);
            onClick?.();
        }
    };

    return (
        <>
            {/* Link */}
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

            {/* Submenu */}
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
