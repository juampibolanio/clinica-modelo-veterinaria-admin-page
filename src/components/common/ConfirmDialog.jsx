import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
import { confirmDialogStyles } from "./styles/confirmDialog.styles";

/**
 * Reusable confirmation dialog with professional styling.
 * @param {boolean} open - Controls the visibility of the dialog.
 * @param {string} title - The title of the dialog.
 * @param {string} message - The message/content to display.
 * @param {function} onClose - Callback when dialog is closed or cancelled.
 * @param {function} onConfirm - Callback when user confirms the action.
 * @param {string} confirmText - Text for the confirm button.
 * @param {string} cancelText - Text for the cancel button.
 * @param {string} confirmColor - Color variant for confirm button ('error' | 'primary').
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
            <DialogTitle sx={confirmDialogStyles.dialogTitle}>
                {title}
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
                <Button
                    onClick={onClose}
                    sx={confirmDialogStyles.cancelButton}
                >
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