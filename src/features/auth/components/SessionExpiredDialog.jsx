import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Slide,
    Stack,
} from "@mui/material";
import { forwardRef } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Animation for dialog
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Dialog displayed when the user's session has expired.
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
            {/* Cambiamos el componente raíz para evitar h2→h6 nesting */}
            <DialogTitle component="div" sx={{ pt: 3 }}>
                <Stack alignItems="center" spacing={1}>
                    <WarningAmberIcon sx={{ fontSize: 48, color: "#ECA52E" }} />
                    <Typography variant="h6" fontWeight={800}>
                        Sesión expirada
                    </Typography>
                </Stack>
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
