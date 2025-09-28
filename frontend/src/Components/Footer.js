import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  List,
  ListItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "About Us", path: "/about" },
        { name: "Team", path: "/team" },
        { name: "Careers", path: "/careers" },
        { name: "Contact", path: "/contact" },
      ],
    },
    {
      title: "Services",
      links: [
        { name: "Financial Planning", path: "/services/financial-planning" },
        { name: "Investment Management", path: "/services/investment" },
        { name: "Retirement Planning", path: "/services/retirement" },
        { name: "Tax Planning", path: "/services/tax" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", path: "/blog" },
        { name: "Guides", path: "/guides" },
        { name: "FAQ", path: "/faq" },
        { name: "Support", path: "/support" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms of Service", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Disclaimer", path: "/disclaimer" },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.mode === "dark" ? "#0F172A" : "#F5F7FA",
        backgroundImage: theme.palette.mode === "dark"
          ? "linear-gradient(to right, #0F172A, #1E293B)"
          : "none",
        py: 6,
        mt: "auto",
        borderTop: theme.palette.mode === "dark"
          ? "1px solid rgba(255, 255, 255, 0.05)"
          : "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and company info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: theme.palette.primary.main }}
              >
                SpendSense
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your trusted partner for personalized financial advice and
              investment strategies. We help you achieve your financial goals
              with confidence.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                color="primary"
                aria-label="Facebook"
                component="a"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Twitter"
                component="a"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                color="primary"
                aria-label="Instagram"
                component="a"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <Grid item xs={6} sm={3} md={2} key={section.title}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {section.title}
              </Typography>
              <List dense disablePadding>
                {section.links.map((link) => (
                  <ListItem key={link.name} disablePadding sx={{ pb: 0.5 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="text.secondary"
                      underline="none"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {link.name}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "center", sm: "flex-start" },
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} SpendSense. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: { xs: 2, sm: 0 },
              justifyContent: "center",
            }}
          >
            <Link
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="none"
              variant="body2"
            >
              Privacy
            </Link>
            <Link
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="none"
              variant="body2"
            >
              Terms
            </Link>
            <Link
              component={RouterLink}
              to="/cookies"
              color="text.secondary"
              underline="none"
              variant="body2"
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
