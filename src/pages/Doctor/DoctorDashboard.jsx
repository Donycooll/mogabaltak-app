import React from "react";
import { Container, Typography, Box, Button, Paper } from "@mui/material";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QueueIcon from "@mui/icons-material/Queue";
import { sendNotification } from "../../firebase";

const DoctorDashboard = () => {
  const { queue, updatePatientStatus, user } = useApp();
  const navigate = useNavigate();

  const docName = user?.name || localStorage.getItem("doctorName") || "الطبيب";

  // تصفية المرضى الذين ينتظرون أو الذين أكملوا فحوصاتهم
  const waitingList = queue.filter((p) => {
    if (p.status === "waiting") return true; // مريض جديد في الانتظار
    if (p.status === "waiting_results" && p.isFollowUp === true) return true; // مريض أنهى فحوصاته وجاء للمراجعة
    return false; // أي حالة أخرى (مثل مريض لسه بيعمل فحوصات) لا يظهر للطبيب
  });

  const inConsultation = queue.find(
    (p) => p.status === "in_consultation" && p.doctorName === docName,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
        <Typography
          variant="h4"
          fontWeight="900"
          color="primary"
          sx={{ mb: 1 }}
        >
          لوحة التحكم
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: "text.secondary" }}>
          مرحباً {docName}
        </Typography>

        {inConsultation && (
          <Paper
            elevation={4}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "#e3f2fd",
              borderRadius: 4,
              borderRight: "10px solid #1976d2",
            }}
          >
            <Typography variant="subtitle1" color="primary" fontWeight="bold">
              المريض الحالي في عيادتك:
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <Typography variant="h5" fontWeight="900">
                {inConsultation.name}
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate(`/consultation/${inConsultation.id}`)}
              >
                دخول للملف
              </Button>
            </Box>
          </Paper>
        )}

        <Typography
          variant="h6"
          sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
        >
          <QueueIcon color="primary" /> قائمة الانتظار ({waitingList.length})
        </Typography>

        <AnimatePresence>
          {waitingList.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  borderRight: p.isFollowUp ? "8px solid #ed6c02" : "none",
                  bgcolor: p.isFollowUp ? "#fff3e0" : "white",
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {p.name}
                  </Typography>
                  {p.isFollowUp && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#ef6c00", fontWeight: "900" }}
                    >
                      ⚠️ نتائج فحوصات جاهزة
                    </Typography>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  disabled={!!inConsultation}
                  onClick={() => {
                    updatePatientStatus(
                      p.id,
                      "in_consultation",
                      p.isFollowUp,
                      docName,
                    );
                    sendNotification(p.fcmToken, p.name);
                    navigate(`/consultation/${p.id}`);
                  }}
                >
                  استدعاء
                </Button>
              </Paper>
            </motion.div>
          ))}
        </AnimatePresence>
      </Container>
    </motion.div>
  );
};

export default DoctorDashboard;
