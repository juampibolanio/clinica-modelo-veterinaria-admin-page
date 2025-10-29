import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slide,
} from "@mui/material";
import { forwardRef } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Animation for dialog
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * This component displays a dialog informing the user that their session has expired.
 * @param {boolean} open - Whether the dialog is open.
 * @param {function} onConfirm - Function to call when the user confirms (e.g., clicks the button).
 * @return {JSX.Element} The SessionExpiredDialog component.
 */
const SessionExpiredDialog = ({ open, onConfirm }) => {
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="xs"
            fullWidth
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                    textAlign: "center",
                    p: 2,
                },
            }}
        >
            <DialogTitle>
                <WarningAmberIcon sx={{ fontSize: 48, color: "#ECA52E", mb: 1 }} />
                <Typography variant="h6" fontWeight={800}>
                    Sesión expirada
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    Tu sesión ha caducado por seguridad.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Por favor, inicia sesión nuevamente para continuar.
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onConfirm}
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 4,
                        py: 1,
                        fontWeight: 700,
                    }}
                >
                    Volver a iniciar sesión
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionExpiredDialog;
