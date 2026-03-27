import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Rating,
  Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const DoctorCard = ({ doctor, onBook }) => {
  return (
    <Card
      sx={{ mb: 2, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" gap={2}>
          <Avatar
            sx={{ width: 60, height: 60, bgcolor: "#e3f2fd", color: "#1976d2" }}
          >
            {doctor.name[3]}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {doctor.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {doctor.specialty}
            </Typography>
            <Rating
              value={doctor.rating}
              readOnly
              size="small"
              precision={1}
              sx={{ mt: 0.5 }}
            />
          </Box>

          <Box sx={{ textAlign: "left" }}>
            <Stack
              direction="row"
              spacing={1}
              justifyContent={"space-evenly"}
              alignItems="center"
              color="success.main"
              sx={{ mb: 1 }}
            >
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight="bold">
                {doctor.waitTime}
              </Typography>
            </Stack>
            <Button
              variant="contained"
              size="small"
              onClick={() => onBook(doctor)}
              sx={{ borderRadius: 2 }}
            >
              حجز دور
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default DoctorCard;
