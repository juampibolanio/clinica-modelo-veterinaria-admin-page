
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
import { navItemStyles } from "./styles/navItem.styles";

/**
 * This component represents a navigation item that can function as a link or a collapsible menu with sub-items.
 * @param {string} label - The text label for the navigation item.
 * @param {JSX.Element} icon - The icon to display alongside the label.
 * @param {string} path - The navigation path for the item.
 * @param {Array<{ label: string, path: string }>} children - An array of sub-items for the collapsible menu.
 * @param {() => void} onClick - The callback function to be executed when the item is clicked.
 * @param {string} color - The color of the navigation item (e.g., 'error' for logout).
 */
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
        if (children) {
            setOpen((prev) => !prev);
        } else {
            navigate(path);
            onClick?.();
        }
    };

    return (
        <>
            {/* Main Navigation Item */}
            <ListItemButton
                onClick={handleClick}
                sx={navItemStyles.listItemButton(active, color)}
            >
                {icon && (
                    <ListItemIcon sx={navItemStyles.listItemIcon(active, color)}>
                        {icon}
                    </ListItemIcon>
                )}
                <ListItemText
                    primary={label}
                    sx={navItemStyles.listItemText(active)}
                />
                {children && (
                    open ? (
                        <ExpandLess sx={navItemStyles.expandIcon(true)} />
                    ) : (
                        <ExpandMore sx={navItemStyles.expandIcon(false)} />
                    )
                )}
            </ListItemButton>

            {/* Submenu (Collapsible) */}
            {children && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List disablePadding sx={navItemStyles.collapse}>
                        {children.map((sub) => {
                            const subActive = location.pathname.startsWith(sub.path);
                            return (
                                <ListItemButton
                                    key={sub.path}
                                    component={NavLink}
                                    to={sub.path}
                                    onClick={onClick}
                                    sx={navItemStyles.subItemButton(subActive)}
                                >
                                    <ListItemText
                                        primary={sub.label}
                                        sx={navItemStyles.subItemText(subActive)}
                                    />
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