import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    Stack,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { confirmDialogStyles } from "./styles/confirmDialog.styles";

/**
 * Reusable confirmation dialog with professional styling.
 * Compatible with MUI SSR (no nested heading errors).
 */
const ConfirmDialog = ({
    open,
    title = "Confirmar",
    message,
    onClose,
    onConfirm,
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    confirmColor = "error", // 'error' or 'primary'
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            sx={confirmDialogStyles.dialog}
        >
            {/* Cambiamos a component="div" para evitar h2→h6 nesting */}
            <DialogTitle component="div" sx={confirmDialogStyles.dialogTitle}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <WarningAmberIcon color="warning" />
                    <Typography variant="h6" fontWeight={800}>
                        {title}
                    </Typography>
                </Stack>
            </DialogTitle>

            <DialogContent sx={confirmDialogStyles.dialogContent}>
                <Typography
                    component="span"
                    variant="body1"
                    sx={confirmDialogStyles.messageText}
                >
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={confirmDialogStyles.dialogActions}>
                <Button onClick={onClose} sx={confirmDialogStyles.cancelButton}>
                    {cancelText}
                </Button>
                <Button
                    variant="contained"
                    onClick={onConfirm}
                    color={confirmColor}
                    sx={
                        confirmColor === "error"
                            ? confirmDialogStyles.confirmButton
                            : confirmDialogStyles.confirmButtonPrimary
                    }
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
