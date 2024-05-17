import {Alert, Snackbar} from "@mui/material";

export const SnackAlert = ({open, message, severity, onClose}) => {
    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
}