import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const PatientDashboard = () => {
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [files] = useState([
    { id: 1, name: "تحليل_دم.pdf", date: "2024-03-20" },
  ]);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }} dir="rtl">
      {/* 1. تتبع الدور */}
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 4, mb: 4, textAlign: "center" }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          حالة دورك الحالية
        </Typography>
        <Box
          sx={{
            my: 3,
            display: "inline-flex",
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "5px solid #1976d2",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography variant="caption">أمامك</Typography>
          <Typography variant="h4" fontWeight="bold">
            4
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={60}
          sx={{ height: 8, borderRadius: 5, mb: 1 }}
        />

        {!isFollowUp ? (
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            fullWidth
            onClick={() => setIsFollowUp(true)}
            sx={{ mt: 2 }}
          >
            أنا جاهز للمراجعة (معي النتائج)
          </Button>
        ) : (
          <Alert severity="success" sx={{ mt: 2 }}>
            أنت الآن في المسار السريع للمراجعة
          </Alert>
        )}
      </Paper>

      {/* 2. رفع الفحوصات */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography fontWeight="bold">نتائج الفحوصات</Typography>
          <Button
            component="label"
            size="small"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            رفع
            <input type="file" hidden />
          </Button>
        </Box>
        <List dense>
          {files.map((file) => (
            <ListItem
              key={file.id}
              sx={{ border: "1px solid #eee", mb: 1, borderRadius: 2 }}
            >
              <ListItemIcon>
                <InsertDriveFileIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={file.name} secondary={file.date} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default PatientDashboard;
