import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Forgot.css";

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    setEmail("");
    navigate("/password-reset-confirmation");
  };

  return (
    <div className="forgot-box-container">
      <Container maxWidth="xs">
        <Box className="forgot-box" p={3} boxShadow={3}>
          <Typography variant="h4" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" paragraph>
            To reset your password, please enter your email address. We will
            send you instructions to reset your password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#00248E",
                "&:hover": { backgroundColor: "#F15400" },
              }}
              fullWidth
            >
              Request Password Reset
            </Button>
          </form>
        </Box>
      </Container>
    </div>
  );
}
