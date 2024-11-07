import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  AppBar,
  Toolbar,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { IoNotifications } from "react-icons/io5";
import { FaCarSide, FaUsers, FaCalendarAlt } from "react-icons/fa";
import NotificationIcon from "./components/Notifications/Notifications";

const StyledCard = styled(Card)(({ theme }) => ({
  minWidth: 275,
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  margin: theme.spacing(2),
  backgroundColor: "#ffffff",
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

const DashboardContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const CardsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "stretch",
  gap: theme.spacing(2),
  marginTop: theme.spacing(4),
}));

const IconContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginBottom: "1rem",
});

const AdminDashboardRe = () => {
  const theme = useTheme();
  const Navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const [notifications] = useState(5);

  const dashboardCards = [
    {
      title: "Manage Driver Fleet",
      icon: <FaUsers size={32} color="#1976d2" />,
      onClick: () => {
        console.log("Navigate to Driver Management");
        Navigate("/admin-dashboard");
      },
    },
    {
      title: "Manage Vehicle Fleet",
      icon: <FaCarSide size={32} color="#1976d2" />,
      onClick: () => {
        console.log("Navigate to Vehicle Management");
        Navigate("/admin-dashboard");
      },
    },
    {
      title: "Manage Booking Fleet",
      icon: <FaCalendarAlt size={32} color="#1976d2" />,
      onClick: () => {
        console.log("Navigate to Booking Management");
        Navigate("/admin-dashboard");
      },
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#ffffff", boxShadow: 1 }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#1976d2" }}
          >
            Admin Dashboard
          </Typography>
          {/* <IconButton size="large" color="primary">
            <Badge badgeContent={notifications} color="error">
              <IoNotifications size={24} />
            </Badge>
          </IconButton> */}
          <NotificationIcon />
        </Toolbar>
      </AppBar>

      <DashboardContainer maxWidth="lg">
        <CardsContainer>
          {dashboardCards.map((card, index) => (
            <StyledCard
              key={index}
              onClick={card.onClick}
              sx={{
                width: isMobile ? "100%" : "30%",
                minHeight: 200,
              }}
            >
              <CardContent>
                <IconContainer>{card.icon}</IconContainer>
                <Typography
                  variant="h6"
                  component="div"
                  align="center"
                  color="primary"
                  gutterBottom
                >
                  {card.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  Click to manage {card.title.toLowerCase()}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}
        </CardsContainer>
      </DashboardContainer>
    </Box>
  );
};

export default AdminDashboardRe;
