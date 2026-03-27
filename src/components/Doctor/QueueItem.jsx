import React from "react";
import { Paper, Typography, Button, Box, Chip, Stack } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpdateIcon from "@mui/icons-material/Update";

const QueueItem = ({ patient, index, onNext }) => {
  // تحديد اللون: برتقالي للمراجعة، أزرق للمريض الجديد
  const themeColor = patient.isFollowUp ? "#ed6c02" : "#1976d2";
  const bgColor = patient.isFollowUp ? "#fffaf5" : "#fff";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 3,
        border: `1px solid ${patient.isFollowUp ? "#ed6c02" : "#eee"}`, // إطار برتقالي للمراجعة
        bgcolor: bgColor,
        transition: "0.3s",
        "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* الدائرة الجانبية باللون المناسب */}
        <Box
          sx={{
            width: 35,
            height: 35,
            bgcolor: themeColor,
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {index + 1}
        </Box>

        <Box>
          <Typography
            fontWeight="bold"
            color={patient.isFollowUp ? "#ed6c02" : "inherit"}
          >
            {patient.name}
          </Typography>
          {patient.isFollowUp && (
            <Chip
              icon={<UpdateIcon sx={{ fontSize: "14px !important" }} />}
              label="مراجعة نتائج"
              size="small"
              sx={{
                mt: 0.5,
                height: 22,
                fontSize: "11px",
                bgcolor: "#ed6c02",
                color: "white",
                "& .MuiChip-icon": { color: "white" },
              }}
            />
          )}
        </Box>
      </Stack>

      <Button
        variant="contained"
        size="small"
        startIcon={<PlayArrowIcon />}
        onClick={() => onNext(patient.id)}
        sx={{
          borderRadius: 2,
          bgcolor: themeColor,
          "&:hover": { bgcolor: patient.isFollowUp ? "#c25401" : "#1565c0" },
        }}
      >
        استدعاء
      </Button>
    </Paper>
  );
};

export default QueueItem;
