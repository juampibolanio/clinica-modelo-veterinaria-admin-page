import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

/**
 * This component displays a confirmation dialog with customizable title, message, and button texts.
 * @param {boolean} open - Whether the dialog is open.
 * @param {string} title - The title of the dialog.
 * @param {string} message - The message to display in the dialog.
 * @param {() => void} onClose - The callback function to be executed when the dialog is closed.
 * @param {() => void} onConfirm - The callback function to be executed when the confirm button is clicked.
 * @param {string} confirmText - The text for the confirm button.
 * @param {string} cancelText - The text for the cancel button.
 */
const ConfirmDialog = ({ open, title = 'Confirmar', message, onClose, onConfirm, confirmText = 'Aceptar', cancelText = 'Cancelar' }) => {
    return (
        <Dialog open={open} onClose={() => onClose?.()}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body2">{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose?.()}>{cancelText}</Button>
                <Button color="error" variant="contained" onClick={() => onConfirm?.()}>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;
