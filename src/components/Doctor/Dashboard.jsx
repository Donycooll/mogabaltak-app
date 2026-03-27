import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";
import QueueItem from "../../components/Doctor/QueueItem";

const DoctorDashboard = () => {
  // بيانات تجريبية لمرضى ينتظرون
  const [queue, setQueue] = useState([
    { id: 101, name: "خالد منصور", queueNumber: 5, isFollowUp: true }, // مراجعة (مسار سريع)
    { id: 102, name: "ياسر عوض", queueNumber: 6, isFollowUp: false },
    { id: 103, name: "منى أحمد", queueNumber: 7, isFollowUp: false },
  ]);

  const [currentPatient, setCurrentPatient] = useState({
    name: "محمد عبدالله",
    queueNumber: 4,
  });

  const handleNextPatient = (id) => {
    // منطق الانتقال للمريض التالي
    const next = queue.find((p) => p.id === id);
    setCurrentPatient(next);
    setQueue(queue.filter((p) => p.id !== id));
    alert(`تم استدعاء المريض رقم ${next.queueNumber}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        لوحة تحكم الطبيب
      </Typography>

      <Grid container spacing={3}>
        {/* المريض الحالي */}
        <Grid item xs={12} md={5}>
          <Card
            sx={{
              bgcolor: "#1976d2",
              color: "white",
              borderRadius: 4,
              textAlign: "center",
              p: 2,
            }}
          >
            <CardContent>
              <Typography variant="h6">المريض الحالي</Typography>
              <Typography variant="h2" fontWeight="900" sx={{ my: 2 }}>
                {currentPatient.queueNumber}
              </Typography>
              <Typography variant="h5">{currentPatient.name}</Typography>
              <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.2)" }} />
              <Typography variant="body2">بدأ الكشف منذ: 12 دقيقة</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* قائمة الانتظار */}
        <Grid item xs={12} md={7}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              قائمة الانتظار التالي
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {queue.length} مرضى منتظرين
            </Typography>
          </Box>

          <Stack>
            {queue.map((patient) => (
              <QueueItem
                key={patient.id}
                patient={patient}
                onNext={handleNextPatient}
              />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorDashboard;
