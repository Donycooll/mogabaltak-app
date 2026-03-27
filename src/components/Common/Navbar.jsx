import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HistoryIcon from "@mui/icons-material/History";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";

const Navbar = () => {
  const { user, logout, queue } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;
  const hasBooking = queue.some(
    (p) => p.name === user.name && p.status !== "finished",
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #eee",
        color: "text.primary",
        zIndex: 1201,
      }}
    >
      <Container maxWidth="md">
        <Toolbar sx={{ justifyContent: "space-between", px: 0 }}>
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(user.role === "doctor" ? "/doctor" : "/")}
          >
            <LocalHospitalIcon sx={{ color: "#1976d2", mr: 1 }} />
            <Typography variant="h6" fontWeight="900" sx={{ color: "#1976d2" }}>
              مقابلتك
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {user.role === "patient" && (
              <>
                <IconButton
                  onClick={() => navigate("/")}
                  color={location.pathname === "/" ? "primary" : "inherit"}
                >
                  <HomeIcon />
                </IconButton>
                {hasBooking && (
                  <Button
                    onClick={() => navigate("/status")}
                    variant={
                      location.pathname === "/status" ? "contained" : "text"
                    }
                    sx={{ fontWeight: "bold" }}
                  >
                    <AssignmentIcon sx={{ml: 1}}/>
                    دوري
                  </Button>
                )}
                <Button
                  onClick={() => navigate("/history")}
                  variant={
                    location.pathname === "/history" ? "contained" : "text"
                  }
                  sx={{ fontWeight: "bold" }}
                >
                  <HistoryIcon sx={{ml: 1}}/>
                  سجلي
                </Button>
              </>
            )}
            <IconButton
              color="error"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              sx={{ ml: 1 }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
