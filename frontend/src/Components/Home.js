import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import SecurityIcon from "@mui/icons-material/Security";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionCard = motion(Card);

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const features = [
    {
      title: "AI-Powered Financial Analysis",
      description:
        "Smart transaction categorization and spending analysis using Google's Gemini AI for actionable insights.",
      icon: <AccountBalanceIcon fontSize="large" color="primary" />,
    },
    {
      title: "Real-Time Transaction Management",
      description:
        "Import bank data, upload CSV files, or add transactions manually with intelligent categorization.",
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
    },
    {
      title: "Personalized Investment Strategies",
      description:
        "Get tailored investment recommendations across 10+ asset classes based on your financial profile.",
      icon: <ShowChartIcon fontSize="large" color="primary" />,
    },
    {
      title: "Comprehensive Financial Planning",
      description:
        "Goal tracking, net worth calculation, and AI-generated budget optimization for your future.",
      icon: <SecurityIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
              : "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: "relative",
          overflow: "hidden",
          "&::before": theme.palette.mode === "dark" ? {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)",
            pointerEvents: "none",
          } : {},
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 6 : 4} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    color: theme.palette.primary.main,
                  }}
                >
                  SpendSense
                </Typography>
                <Typography
                  variant="h5"
                  color="textSecondary"
                  paragraph
                  sx={{ mb: 4, maxWidth: "90%" }}
                >
                  Accelerate your financial intelligence with AI-powered insights,
                  smart transaction analysis, and personalized investment guidance.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                    onClick={() => navigate("/signup")}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size={isMobile ? "medium" : "large"}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </Stack>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={require("../Assets/Images/image.jpg")}
                  alt="Financial Advisory"
                  sx={{
                    width: "100%",
                    maxWidth: isMobile ? 350 : 500,
                    height: "auto",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services">
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <MotionTypography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: 600,
              fontSize: isMobile ? "2rem" : "2.5rem",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </MotionTypography>
          <Grid container spacing={isTablet ? 3 : 4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      textAlign: "center",
                      p: isTablet ? 2 : 3,
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h5" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box
        id="about"
        sx={{
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)"
              : "linear-gradient(135deg, #BBDEFB 0%, #90CAF9 100%)",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 6 : 4} alignItems="center">
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <MotionBox
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    fontSize: isMobile ? "2rem" : "2.5rem",
                  }}
                >
                  Why Choose SpendSense?
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isTablet ? 1.5 : 2,
                      mb: 2,
                      backgroundColor: theme.palette.background.paper,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Smart Transaction Intelligence
                    </Typography>
                    <Typography variant="body1">
                      Advanced AI categorization and spending analysis helps you understand
                      your financial patterns and make informed decisions about your money.
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isTablet ? 1.5 : 2,
                      mb: 2,
                      backgroundColor: theme.palette.background.paper,
                      borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Multi-Source Data Integration
                    </Typography>
                    <Typography variant="body1">
                      Seamlessly connect bank accounts, upload CSV files, or manually add
                      transactions - all unified in one intelligent financial dashboard.
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isTablet ? 1.5 : 2,
                      backgroundColor: theme.palette.background.paper,
                      borderLeft: `4px solid ${theme.palette.primary.main}`,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      AI-Powered Investment Guidance
                    </Typography>
                    <Typography variant="body1">
                      Receive personalized investment recommendations and step-by-step
                      strategies powered by advanced AI analysis of your financial profile.
                    </Typography>
                  </Paper>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "medium" : "large"}
                  onClick={() => navigate("/form")}
                >
                  Start Your Assessment
                </Button>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <MotionBox
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1650821414390-276561abd95a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Financial Planning"
                  sx={{
                    width: "100%",
                    maxWidth: isMobile ? 350 : 500,
                    height: "auto",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  }}
                />
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: { xs: 6, md: 10 }, textAlign: "center" }}>
        <Container maxWidth="md">
          <MotionTypography
            variant="h3"
            component="h2"
            gutterBottom
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ fontSize: isMobile ? "2rem" : "2.5rem" }}
          >
            Ready to accelerate your financial intelligence?
          </MotionTypography>
          <MotionTypography
            variant="h6"
            color="textSecondary"
            paragraph
            sx={{ mb: 4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join users who are transforming their financial future with
            AI-powered insights and smart transaction management.
          </MotionTypography>
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Button
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              sx={{ px: isMobile ? 3 : 4, py: isMobile ? 1 : 1.5 }}
              onClick={() => navigate("/signup")}
            >
              Get Started Today
            </Button>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
}
