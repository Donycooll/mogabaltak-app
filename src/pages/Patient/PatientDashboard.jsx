import React, { useEffect, useRef } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const PatientDashboard = () => {
  const { queue, updatePatientStatus, user } = useApp();
  const navigate = useNavigate();

  // 1. البحث عن المريض في القائمة النشطة (الانتظار أو الكشف أو الفحوصات)
  const myInfo = queue.find((p) => p.name === user?.name);

  const prevStatus = useRef(myInfo?.status);

  useEffect(() => {
    if (
      myInfo?.status === "in_consultation" &&
      prevStatus.current !== "in_consultation"
    ) {
      toast.error("🔔 دورك الآن! تفضل بالدخول للطبيب.", { duration: 10000 });
      new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
      )
        .play()
        .catch(() => {});
    }
    prevStatus.current = myInfo?.status;
  }, [myInfo]);

  // 2. إذا لم يجد المريض في القائمة (يعني انتهى الكشف تماماً وحُذف المريض)
  if (!myInfo)
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
          <CheckCircleOutlineIcon
            sx={{ fontSize: 70, color: "#4caf50", mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            اكتملت زيارتك بنجاح!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            نتمنى لك دوام الصحة والعافية. يمكنك العودة للصفحة الرئيسية.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{ borderRadius: 3, px: 4 }}
          >
            العودة للرئيسية
          </Button>
        </motion.div>
      </Container>
    );

  // حساب الترتيب في الصف للمنتظرين فقط
  const currentRank =
    queue.filter(
      (p) => p.status === "waiting" && p.createdAt < myInfo?.createdAt,
    ).length + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }} dir="rtl">
        {/* حالة انتظار الفحوصات */}
        {myInfo.status === "waiting_results" ? (
          <Paper
            elevation={4}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 5,
              borderTop: "10px solid #ed6c02",
            }}
          >
            <Typography variant="h5" fontWeight="bold" color="warning.main">
              في انتظار نتائج الفحوصات
            </Typography>
            <Typography sx={{ my: 3 }} color="text.secondary">
              الطبيب طلب منك إجراء بعض الفحوصات. عند استلام النتائج، اضغط الزر
              أدناه للعودة للطابور مرة أخرى.
            </Typography>
            <Button
              variant="contained"
              color="warning"
              fullWidth
              startIcon={<CloudUploadIcon />}
              onClick={() => updatePatientStatus(myInfo.id, "waiting", true)}
              sx={{ py: 2, borderRadius: 3, fontWeight: "bold" }}
            >
              استلمت النتائج (العودة للطابور)
            </Button>
          </Paper>
        ) : (
          /* حالة الانتظار العادي أو داخل الكشف */
          <Paper
            elevation={4}
            sx={{ p: 4, textAlign: "center", borderRadius: 5 }}
          >
            <Typography variant="h6" color="text.secondary">
              {myInfo.status === "in_consultation"
                ? "حالتك الآن"
                : "رقمك في الانتظار"}
            </Typography>

            <Typography
              variant="h1"
              fontWeight="900"
              color="primary"
              sx={{ my: 2 }}
            >
              {myInfo.status === "in_consultation" ? "0" : currentRank}
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              {myInfo.status === "in_consultation"
                ? "أنت الآن مع الطبيب.."
                : currentRank === 1
                  ? "أنت المريض التالي، استعد!"
                  : `باقي ${currentRank - 1} مرضى أمامك`}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {myInfo.status === "in_consultation"
                  ? "يتم الآن تسجيل بياناتك.."
                  : "تقدم الطابور تلقائياً.."}
              </Typography>
              <LinearProgress
                variant={
                  myInfo.status === "in_consultation"
                    ? "indeterminate"
                    : "determinate"
                }
                value={
                  myInfo.status === "in_consultation"
                    ? 100
                    : (1 / (currentRank + 1)) * 100
                }
                sx={{ height: 12, borderRadius: 5 }}
              />
            </Box>
          </Paper>
        )}
      </Container>
    </motion.div>
  );
};

export default PatientDashboard;
