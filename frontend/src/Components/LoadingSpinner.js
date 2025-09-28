import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "200px",
        width: "100%",
        p: 3,
      }}
    >
      <CircularProgress size={60} thickness={4} color="primary" />
      <Typography variant="h6" sx={{ mt: 2, fontWeight: 500 }}>
        {message}
      </Typography>
    </MotionBox>
  );
}
