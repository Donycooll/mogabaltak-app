import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useApp } from "../../context/AppContext";
import { motion } from "framer-motion";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const MedicalHistory = () => {
  const { user } = useApp();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      // التأكد من وجود مستخدم مسجل الدخول
      if (!user?.name) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const historyRef = collection(db, "history");

        // جلب الزيارات الخاصة بهذا المريض فقط
        const q = query(historyRef, where("patientName", "==", user.name));
        const querySnapshot = await getDocs(q);

        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // ترتيب الزيارات برمجياً من الأحدث للأقدم لضمان العمل بدون Index
        const sortedDocs = docs.sort((a, b) => (b.date || 0) - (a.date || 0));

        setHistory(sortedDocs);
      } catch (error) {
        console.error("Error fetching medical history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }} dir="rtl">
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 4 }}>
          <HistoryEduIcon color="primary" sx={{ fontSize: 35 }} />
          <Typography variant="h4" fontWeight="900" color="primary">
            سجلي الطبي
          </Typography>
        </Stack>

        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <CircularProgress size={50} />
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              جاري استرجاع سجلاتك الطبية...
            </Typography>
          </Box>
        ) : history.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 8,
              textAlign: "center",
              borderRadius: 5,
              border: "2px dashed #e0e0e0",
              bgcolor: "transparent",
            }}
          >
            <Typography color="text.disabled" variant="h6">
              لا توجد زيارات سابقة مسجلة حتى الآن.
            </Typography>
            <Typography color="text.disabled" variant="body2">
              تظهر هنا سجلاتك بعد إتمام الكشف عند الطبيب.
            </Typography>
          </Paper>
        ) : (
          history.map((visit) => (
            <Card
              key={visit.id}
              sx={{
                mb: 3,
                borderRadius: 4,
                border: "1px solid #eee",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.01)" },
              }}
            >
              <Box
                sx={{
                  bgcolor: "#f8faff",
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    الطبيب المعالج:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {visit.doctorName || "طبيب مناوب"}
                  </Typography>
                </Box>
                <Chip
                  label={
                    visit.date
                      ? new Date(visit.date).toLocaleDateString("ar-EG")
                      : "تاريخ غير معروف"
                  }
                  size="small"
                  color="primary"
                  sx={{ fontWeight: "bold" }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="caption"
                  color="primary"
                  fontWeight="bold"
                  sx={{ display: "block", mb: 1 }}
                >
                  التشخيص والتوصيات المكتوبة:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    lineHeight: 1.8,
                    color: "#2c3e50",
                    bgcolor: "#fff",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #f9f9f9",
                  }}
                >
                  {visit.diagnosis ||
                    "لم يكتب الطبيب ملاحظات إضافية لهذه الزيارة."}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Container>
    </motion.div>
  );
};

export default MedicalHistory;
