import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";

const BookingDialog = ({ open, handleClose, doctor, onConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" dir="rtl">
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "right" }}>
        تأكيد حجز الموعد
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold" }}>
          الطبيب: {doctor?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          سيتم إضافتك لقائمة الانتظار اللحظية وتمنح ترتيباً بناءً على عدد
          الموجودين حالياً.
        </Typography>

        <Alert severity="info" icon={<EventNoteIcon />} sx={{ mt: 3 }}>
          الرجاء التواجد في العيادة عند اقتراب دورك.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          إلغاء
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{ fontWeight: "bold", px: 4 }}
        >
          تأكيد
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingDialog;
