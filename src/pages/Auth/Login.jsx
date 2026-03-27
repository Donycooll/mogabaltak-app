import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Login = () => {
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [password, setPassword] = useState(""); // هذا هو الـ state الذي يمثل الرمز (passcode)
  const { login } = useApp();
  const navigate = useNavigate();

  // الدالة الأساسية لتسجيل الدخول
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tab === 0) {
      // شغل المريض كما هو
      if (!name.trim()) return toast.error("أدخل اسمك");
      login({ name, role: "patient" });
      navigate("/");
    } else {
      // شغل الدكتور المربوط بـ Firebase
      if (!password.trim()) return toast.error("أدخل رمز الدخول");

      try {
        // استعلام للبحث عن طبيب يملك هذا الرمز في Firestore
        const q = query(
          collection(db, "doctors"),
          where("passcode", "==", password),
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doctorData = querySnapshot.docs[0].data();

          // حفظ الاسم في localStorage عشان يستخدمه التطبيق
          localStorage.setItem("doctorName", doctorData.name);

          // إبلاغ الـ Context أن الدكتور دخل
          login({ name: doctorData.name, role: "doctor" });

          toast.success(`مرحباً ${doctorData.name}`);
          navigate("/doctor");
        } else {
          toast.error("رمز الدخول غير صحيح");
        }
      } catch (error) {
        console.error("Error logging in:", error);
        toast.error("حدث خطأ في الاتصال بقاعدة البيانات");
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Container maxWidth="xs" sx={{ py: 10 }}>
        <Paper
          elevation={10}
          sx={{ p: 4, borderRadius: 5, textAlign: "center" }}
        >
          <Typography variant="h4" fontWeight="900" color="primary">
            مقابلتك
          </Typography>
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="fullWidth"
            sx={{ my: 3 }}
          >
            <Tab icon={<PersonIcon />} label="مريض" />
            <Tab icon={<LocalHospitalIcon />} label="طبيب" />
          </Tabs>
          <form onSubmit={handleSubmit}>
            {tab === 0 ? (
              <TextField
                fullWidth
                label="اسم المريض"
                sx={{ mb: 3 }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <TextField
                fullWidth
                type="password"
                label="رمز دخول الطبيب"
                sx={{ mb: 3 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ py: 1.5 }}
            >
              دخول
            </Button>
          </form>
        </Paper>
      </Container>
    </motion.div>
  );
};

export default Login;
