import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

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
