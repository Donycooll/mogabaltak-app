import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Consultation = () => {
  const { queue, finishConsultation } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const patient = queue.find((p) => p.id === id);

  const [notes, setNotes] = useState("");
  const [needsTests, setNeedsTests] = useState(false);

  // ✅ الإصلاح: مراقبة وجود المريض وتغير حالته
  useEffect(() => {
    // 1. الخروج إذا لم يوجد مريض أو تغيرت حالته
    if (!patient || patient.status !== "in_consultation") {
      const timer = setTimeout(() => navigate("/doctor"), 100);
      return () => clearTimeout(timer);
    }

    // 2. تعبئة البيانات فقط إذا كانت الحقول فارغة (عند أول تحميل للملف)
    // استخدمنا الدوال الوظيفية للتحديث لتجنب الحاجة لوضع notes/needsTests في المصفوفة
    setNotes((prev) => (prev === "" ? patient.diagnosis || "" : prev));
    setNeedsTests((prev) =>
      prev === false ? patient.status === "waiting_results" : prev,
    );
  }, [patient, navigate]);

  const handleFinalize = async () => {
    try {
      const currentDocName = localStorage.getItem("doctorName") || "طبيب مناوب";

      // ننتظر العملية
      await finishConsultation(id, needsTests, notes, currentDocName);

      toast.success(
        needsTests ? "تم إرسال المريض للفحوصات" : "تم حفظ المقابلة في السجل",
      );

      // الـ useEffect سيتكفل بالتحويل تلقائياً الآن بمجرد تحديث الحالة في Firebase
    } catch (error) {
      console.error("Finalize error:", error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };

  if (!patient)
    return (
      <Container sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6">جاري الحفظ والعودة للوحة التحكم...</Typography>
      </Container>
    );

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
    >
      <Container maxWidth="md" sx={{ py: 4 }} dir="rtl">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <IconButton onClick={() => navigate("/doctor")} sx={{ ml: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="900">
              كشف: {patient.name}
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <TextField
            fullWidth
            multiline
            rows={8}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="اكتب التشخيص، العلاج، أو الفحوصات المطلوبة هنا..."
            sx={{ mb: 4, bgcolor: "#fcfcfc" }}
          />

          <Box sx={{ p: 2, mb: 4, bgcolor: "#f5f5f5", borderRadius: 3 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={needsTests}
                  onChange={(e) => setNeedsTests(e.target.checked)}
                  color="warning"
                />
              }
              label={
                <Typography fontWeight="bold" color="warning.dark">
                  المريض يحتاج لفحوصات إضافية (سيبقى في القائمة)
                </Typography>
              }
            />
          </Box>

          <Button
            variant="contained"
            color={needsTests ? "warning" : "success"}
            fullWidth
            size="large"
            onClick={handleFinalize}
            sx={{
              py: 2,
              borderRadius: 3,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {needsTests
              ? "إرسال للفحص وحفظ الملاحظات"
              : "اعتماد وإنهاء المقابلة نهائياً"}
          </Button>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Consultation;
