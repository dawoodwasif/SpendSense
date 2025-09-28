import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Alert,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Forgot.css";

const MotionCard = motion(Card);

export default function ForgotUserID() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{ borderRadius: 2, overflow: "hidden" }}
          >
            <Box sx={{ bgcolor: "primary.main", py: 2, px: 3, display: "flex", alignItems: "center" }}>
              <IconButton sx={{ color: "white", mr: 1 }} onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" color="white" fontWeight={500}>
                Forgot User ID
              </Typography>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <HelpOutlineIcon color="primary" sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
                <Typography variant="h6" gutterBottom>
                  Need help with your User ID?
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 4 }}>
                To recover your User ID, please contact support or follow the instructions sent to your email.
              </Alert>

              <Box sx={{ mb: 4 }}>
                <Typography variant="body1" paragraph>
                  If you've forgotten your User ID, you have a few options:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    Check your email for registration confirmation or recent account activity notices
                  </Typography>
                  <Typography component="li" variant="body1" sx={{ mb: 1 }}>
                    Contact our customer support team at support@spendsense.com
                  </Typography>
                  <Typography component="li" variant="body1">
                    Call our help desk at (555) 123-4567 during business hours
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBack}
                  sx={{ mr: 2 }}
                >
                  Back to Login
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password Instead?
                </Button>
              </Box>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>
    </Container>
  );
}
