import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Alert,
  Box,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DoctorCard from "../../components/Patient/DoctorCard";
import BookingDialog from "../../components/Patient/BookingDialog";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Home = () => {
  const [doctors, setDoctors] = useState([]);

  const { queue, addToQueue, user } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const docsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(docsList);
    };
    fetchDoctors();
  }, []);

  const hasActiveBooking = queue.some(
    (p) => p.name === user?.name && p.status !== "finished",
  );

  const handleConfirmBooking = () => {
    if (selectedDoc) {
      // نمرر اسم المريض واسم الدكتور المختار
      addToQueue(user.name, selectedDoc.name);
      setOpen(false);
      navigate("/status");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }} dir="rtl">
        <Typography variant="h4" fontWeight="900" gutterBottom color="primary">
          احجز طبيبك
        </Typography>

        {hasActiveBooking && (
          <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
            لديك حجز قائم حالياً.{" "}
            <Button onClick={() => navigate("/status")}>تتبع دورك</Button>
          </Alert>
        )}

        <TextField
          fullWidth
          placeholder="ابحث عن طبيب..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4, bgcolor: "white" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          {doctors
            .filter((d) => d.name && d.name.includes(searchTerm))
            .map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onBook={(d) => {
                  if (!hasActiveBooking) {
                    setSelectedDoc(d);
                    setOpen(true);
                  }
                }}
              />
            ))}
        </Box>

        <BookingDialog
          open={open}
          handleClose={() => setOpen(false)}
          onConfirm={handleConfirmBooking}
          doctor={selectedDoc}
        />
      </Container>
    </motion.div>
  );
};

export default Home;
