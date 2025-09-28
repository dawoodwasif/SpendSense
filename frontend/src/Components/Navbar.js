import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
  Container,
  Switch,
  FormControlLabel,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar({ toggleColorMode, mode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userData, setUserData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status and fetch user data when component mounts
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    setIsAuthenticated(!!authToken);
    setUserEmail(email || "");
    setUserName(name || "");

    // Fetch user data if authenticated
    if (authToken) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://localhost:5000/user-profile", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);

            // Update userName if available from API
            if (data.user && data.user.name) {
              setUserName(data.user.name);
              localStorage.setItem("userName", data.user.name);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [location]); // Re-fetch when location changes

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserEmail("");
    setUserName("");
    setUserData(null);
    handleMenuClose();
    navigate("/");
  };

  // Get the first letter of user's name for the avatar
  const getInitial = () => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    if (userName && userName.length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    if (userEmail && userEmail.length > 0) {
      return userEmail.charAt(0).toUpperCase();
    }
    return "U";
  };

  const scrollToSection = (sectionId) => {
    // Close drawer if open
    if (drawerOpen) {
      setDrawerOpen(false);
    }

    // If not on home page, navigate to home page with hash
    if (location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    // If already on home page, scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === "/";

  const navItems = [
    { name: "Home", path: "/", action: () => (window.location.href = "/") },
    {
      name: "Services",
      path: "/#services",
      action: () => scrollToSection("services"),
    },
    { name: "About", path: "/#about", action: () => scrollToSection("about") },
    {
      name: "Contact",
      path: "/#contact",
      action: () => scrollToSection("contact"),
    },
  ];

  // Items for authenticated users only
  const authNavItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      action: () => navigate("/dashboard"),
      icon: <DashboardIcon />,
    },
    {
      name: "Profile",
      path: "/profile",
      action: () => navigate("/profile"),
      icon: <PersonIcon />,
    },
  ];

  // Choose which navigation items to display based on authentication

  // Handle hash links when page loads
  useEffect(() => {
    if (isHomePage && location.hash) {
      // Remove the # character
      const sectionId = location.hash.substring(1);

      // Add a small delay to ensure the page is fully loaded
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location, isHomePage]);

  // Logged in user drawer (left side)
  const authDrawer = (
    <Box
      sx={{
        width: 250,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      role="presentation"
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
              mr: 2,
            }}
          >
            {getInitial()}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {userData?.name || userName || "User"}
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {authNavItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={() => {
              item.action();
              handleDrawerToggle();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === "dark"}
              onChange={toggleColorMode}
              color="primary"
            />
          }
          label={mode === "dark" ? "Dark Mode" : "Light Mode"}
        />
      </Box>

      <Divider />

      <ListItem
        button
        onClick={handleLogout}
        sx={{ bgcolor: theme.palette.action.hover }}
      >
        <ListItemIcon>
          <LogoutIcon color="error" />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{ color: "error" }}
        />
      </ListItem>
    </Box>
  );

  // Non-authenticated user drawer (right side)
  const publicDrawer = (
    <Box sx={{ width: 250, height: "100%" }} role="presentation">
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.name}
            onClick={item.action}
            sx={{ textDecoration: "none" }}
          >
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={mode === "dark"}
                onChange={toggleColorMode}
                color="primary"
              />
            }
            label={mode === "dark" ? "Dark Mode" : "Light Mode"}
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo and Menu Button for logged in users */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isAuthenticated && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <RouterLink
              to={isAuthenticated ? "/dashboard" : "/"}
              style={{ textDecoration: "none" }}
            >
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block" },
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                }}
              >
                SpendSense
              </Typography>
            </RouterLink>
          </Box>

          {/* Desktop Navigation - only for non-authenticated users */}
          {!isMobile && !isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  onClick={item.action}
                  sx={{ mx: 1, textDecoration: "none" }}
                >
                  {item.name}
                </Button>
              ))}
              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                <IconButton onClick={toggleColorMode} color="inherit">
                  {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Mobile Navigation - For non-authenticated users */}
          {isMobile && !isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1, textDecoration: "none" }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/signup"
                sx={{ textDecoration: "none" }}
              >
                Sign Up
              </Button>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Mobile User Menu Icon - For authenticated users */}
          {isMobile && isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                sx={{ mr: 1 }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {getInitial()}
                </Avatar>
              </IconButton>
            </Box>
          )}

          {/* Auth Buttons (Desktop) - For non-authenticated users */}
          {!isMobile && !isAuthenticated && (
            <Box>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                sx={{ mr: 1, textDecoration: "none" }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/signup"
                sx={{ textDecoration: "none" }}
              >
                Sign Up
              </Button>
            </Box>
          )}

          {/* Desktop User Info - For authenticated users */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                color="inherit"
                onClick={toggleColorMode}
                sx={{ mr: 2 }}
              >
                {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              <Typography variant="body2" sx={{ mr: 1 }}>
                {userName}
              </Typography>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {getInitial()}
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Drawer - changes side based on authentication status */}
      <Drawer
        anchor={isAuthenticated ? "left" : "right"}
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        {isAuthenticated ? authDrawer : publicDrawer}
      </Drawer>

      {/* Mobile user menu */}
      <Menu
        id="menu-appbar-mobile"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/dashboard");
          }}
        >
          Dashboard
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            handleLogout();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
