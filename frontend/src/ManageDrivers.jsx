import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Collapse,
  Button,
  Avatar,
  Divider,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import { IoMdNotifications } from "react-icons/io";
import { FaCarAlt, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BadgeIcon from "@mui/icons-material/Badge";
import site from "./components/common/API";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "20px",
  margin: "20px 0",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  },
}));

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const mockNotifications = [
  { _id: 1, message: "New ride request received", time: "5 min ago" },
  {
    _id: 2,
    message: "Driver John completed 10 trips today",
    time: "1 hour ago",
  },
  { _id: 3, message: "System maintenance scheduled", time: "2 hours ago" },
];

const AdminDashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedPanel, setExpandedPanel] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [driverRequests, setDriverRequests] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await site.get("/api/driver/", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setDrivers(response.data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    const fetchDriverRequests = async () => {
      try {
        const response = await site.get("/api/admin/driver-requests", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setDriverRequests(response.data);
      } catch (error) {
        console.error("Error fetching driver requests:", error);
      }
    };

    fetchDrivers();
    fetchDriverRequests();
  }, []);

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const handleDriverDelete = (driverId) => {
    setSelectedDriver(driverId);
    setOpenDeleteDialog(true);
  };

  const confirmDeleteDriver = async () => {
    // Confirm deletion
    try {
      // Call the delete driver API
      const response = await site.delete(
        `/api/admin/delete/${selectedDriver}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      Alert(response.data.message);

      // Update the drivers state after successful deletion
      setDrivers(drivers.filter((driver) => driver._id !== selectedDriver)); // Remove driver from the list
      setOpenDeleteDialog(false); // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting driver:", error);
      setOpenDeleteDialog(false); // Close the dialog on error
    }
  };

  const handleApproveReject = async (driverId, action) => {
    try {
      const response = await site.patch(
        `/api/admin/approve-driver-request/${driverId}`,
        { action },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      console.log(response);
      Alert(response.data.message);
      setDriverRequests(
        driverRequests.filter((request) => request._id !== driverId)
      );
    } catch (error) {
      console.error(`Error ${action}ing driver request:`, error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <IconButton onClick={handleNotificationClick}>
            <Badge badgeContent={mockNotifications.length} color="primary">
              <IoMdNotifications size={24} />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNotificationClose}
          >
            {mockNotifications.map((notification) => (
              <MenuItem
                key={notification._id}
                onClick={handleNotificationClose}
              >
                <Box>
                  <Typography variant="body1">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {notification.time}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <StyledPaper elevation={3}>
              <Typography variant="h6" gutterBottom>
                Driver List
              </Typography>
              <List>
                {drivers.map((driver) => (
                  <Paper
                    key={driver._id}
                    elevation={3}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <ListItem
                      disableGutters
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                      }}
                    >
                      <Avatar
                        src={driver.image}
                        alt={driver.name}
                        sx={{ mr: 2 }}
                      />
                      <ListItemText
                        primary={driver.name}
                        secondary={
                          <Stack spacing={1} sx={{ mt: 1 }}>
                            <Typography variant="body2">
                              {`Status: ${driver.status} • Trips: ${driver.level} • Rating: ${driver.rating}`}
                            </Typography>

                            <Box display="flex" alignItems="center">
                              <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {driver.phone}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                              <BadgeIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">{`License Number: ${driver.licenseNumber}`}</Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                              <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                              <Typography variant="body2">
                                {driver.user
                                  ? `Email: ${driver.user.email}`
                                  : "Email: Not Available"}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                              <DirectionsCarIcon
                                fontSize="small"
                                sx={{ mr: 1 }}
                              />
                              <Typography variant="body2">
                                {`Vehicle Assigned: ${
                                  driver.vehicle
                                    ? `${driver.vehicle.model} (${driver.vehicle.type})`
                                    : "No vehicle assigned"
                                }`}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body2"
                              sx={{
                                fontStyle: "italic",
                                color: "text.secondary",
                              }}
                            >
                              {`Joined On: ${new Date(
                                driver.createdAt
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}`}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Tooltip title="Delete Driver">
                        <IconButton
                          edge="end"
                          onClick={() => handleDriverDelete(driver._id)}
                          color="error"
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </StyledPaper>
          </Grid>

          <Grid item xs={12} md={4}>
            <StyledPaper elevation={3}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Request Management</Typography>
                <IconButton onClick={() => setExpandedPanel(!expandedPanel)}>
                  {expandedPanel ? <FaChevronUp /> : <FaChevronDown />}
                </IconButton>
              </Box>
              <Collapse in={expandedPanel}>
                <List>
                  {driverRequests.length > 0 ? (
                    driverRequests.map((request) => (
                      <Card key={request._id} sx={{ mb: 2 }}>
                        <CardContent>
                          <ListItem
                            sx={{
                              mb: 2,
                              borderRadius: 1,
                              bgcolor: "background.paper",
                              "&:hover": { bgcolor: "action.hover" },
                            }}
                          >
                            <Avatar
                              src={request.image}
                              alt={request.name}
                              sx={{ mr: 2 }}
                            />
                            <ListItemText
                              primary={request.name}
                              secondary={
                                <React.Fragment>
                                  <Typography component="span" variant="body2">
                                    {`• License Number: ${request.licenseNumber}`}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    {`• Phone: ${request.phone}`}
                                  </Typography>
                                  <br />
                                  <Typography component="span" variant="body2">
                                    {`• Requested: ${new Date(
                                      request.createdAt
                                    ).toLocaleString("en-IN", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}`}
                                  </Typography>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() =>
                                handleApproveReject(request._id, "approve")
                              }
                              sx={{ mr: 1 }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              onClick={() =>
                                handleApproveReject(request._id, "reject")
                              }
                            >
                              Decline
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      align="center"
                    >
                      No driver requests available at the moment.
                    </Typography>
                  )}
                </List>
              </Collapse>
            </StyledPaper>
          </Grid>
        </Grid>

        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this driver?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={confirmDeleteDriver} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
