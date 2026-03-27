import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useApp } from "./context/AppContext";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { requestForToken } from "./firebase";

// المكونات
import Navbar from "./components/Common/Navbar";
import Login from "./pages/Auth/Login";
import Home from "./pages/Patient/Home";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import MedicalHistory from "./pages/Patient/MedicalHistory";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import Consultation from "./pages/Doctor/Consultation";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute role="patient">
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute role="patient">
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute role="patient">
              <MedicalHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultation/:id"
          element={
            <ProtectedRoute role="doctor">
              <Consultation />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  useEffect(() => {
    // طلب الإذن والحصول على التوكن أول ما يفتح التطبيق
    requestForToken();
  }, []);
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{ style: { fontFamily: "Tajawal", direction: "rtl" } }}
      />
      <Navbar />
      <AnimatedRoutes />
    </Router>
  );
}
export default App;
