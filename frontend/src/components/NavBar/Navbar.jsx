import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import { FiMenu, FiPackage, FiLogOut } from "react-icons/fi";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#ffffff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
}));

const LogoContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const StyledButton = styled(Button)({
  borderRadius: "8px",
  textTransform: "none",
  padding: "8px 16px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
});

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(null);
  const navigate = useNavigate();

  const handleOpenMobileMenu = (event) => {
    setMobileMenu(event.currentTarget);
  };

  const handleCloseMobileMenu = () => {
    setMobileMenu(null);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Remove role from local storage
    localStorage.removeItem("role");

    // Optionally, navigate to the login page after logout
    navigate("/login");
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LogoContainer
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <FiPackage size={24} color="#1976d2" aria-label="GoodsBecho logo" />
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                fontSize: "1.2rem",
              }}
            >
              GoodsBecho
            </Typography>
          </LogoContainer>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="mobile menu"
              aria-controls="mobile-menu"
              aria-haspopup="true"
              onClick={handleOpenMobileMenu}
              color="primary"
            >
              <FiMenu />
            </IconButton>
            <Menu
              id="mobile-menu"
              anchorEl={mobileMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(mobileMenu)}
              onClose={handleCloseMobileMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <LogoContainer
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <FiPackage size={24} color="#1976d2" aria-label="GoodsBecho logo" />
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: "#1976d2",
                fontWeight: 600,
                fontSize: "1.2rem",
              }}
            >
              GoodsBecho
            </Typography>
          </LogoContainer>

          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
              gap: 2,
            }}
          >
            <StyledButton
              variant="outlined"
              color="primary"
              startIcon={<FiLogOut />}
              onClick={handleLogout}
              aria-label="Logout from application"
            >
              Logout
            </StyledButton>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Navbar;
