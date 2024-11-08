import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Snackbar,
  Alert,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FaBicycle,
  FaCar,
  FaVanShuttle,
  FaTruck,
  FaTrash,
  FaPlus,
  FaFilter,
} from "react-icons/fa6";

import site from "../common/API";

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.2s",
  height: "100%",
  backgroundColor: "#ffffff",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },
}));

const AddVehicleCard = styled(Card)({
  backgroundColor: "#f8f9fa",
  border: "2px dashed #dee2e6",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.2s",
  "&:hover": {
    backgroundColor: "#e9ecef",
    borderColor: "#adb5bd",
  },
});

const vehicleIcons = {
  bike: FaBicycle,
  car: FaCar,
  van: FaVanShuttle,
  truck: FaTruck,
};

const vehicleColors = {
  bike: "#4caf50",
  car: "#2196f3",
  van: "#ff9800",
  truck: "#f44336",
};

const getToken = () =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const VehicleManagementDashboard = () => {
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    type: "",
    plateNumber: "",
    model: "",
    capacity: "",
    available: true,
  });

  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);

  const fetchVehicles = async () => {
    try {
      const response = await site.get("/api/vehicle/", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setVehicles(response.data); // Set the fetched vehicle data
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setSnackbar({
        open: true,
        message: "Failed to load vehicles",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    // Fetch vehicles from API on component mount
    fetchVehicles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.type) newErrors.type = "Vehicle type is required";
    if (!formData.plateNumber)
      newErrors.plateNumber = "Plate number is required";
    if (!formData.model) newErrors.model = "Model is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare the data to send to the API
    const vehicleData = {
      type: formData.type,
      plateNumber: formData.plateNumber,
      model: formData.model,
      capacity: formData.capacity,
      availability: formData.available,
    };

    try {
      const response = await site.post("/api/vehicle/create", vehicleData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      // console.log(response);

      if (response.status === 201) {
        // Successfully added the vehicle, update the vehicles state
        setVehicles((prev) => [...prev, { ...vehicleData, id: Date.now() }]);

        // Reset the form and hide it
        setFormData({
          type: "",
          plateNumber: "",
          model: "",
          capacity: "",
          available: true,
        });

        setShowForm(false);

        // Show a success message in the snackbar
        setSnackbar({
          open: true,
          message: "Vehicle added successfully!",
          severity: "success",
        });
      } else {
        // Handle failure response from API
        setSnackbar({
          open: true,
          message: "Failed to add vehicle!",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setSnackbar({
        open: true,
        message: "An error occurred while adding the vehicle.",
        severity: "error",
      });
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setOpenDialog(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      // Make an API call to delete the vehicle
      const response = await site.delete(
        `/api/admin/delete-vehicle/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` }, // Include the auth token
        }
      );

      if (response.status === 200) {
        // If the vehicle is successfully deleted, remove it from the list
        setVehicles((prev) =>
          prev.filter((vehicle) => vehicle._id !== deleteId)
        );

        setOpenDialog(false); //close the confirmation dialog

        setSnackbar({
          // Show a success message in the snackbar
          open: true,
          message: "Vehicle deleted successfully!",
          severity: "success",
        });

        fetchVehicles();
      } else {
        // Handle failure response from API
        setSnackbar({
          open: true,
          message: "Failed to delete vehicle!",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setSnackbar({
        open: true,
        message: `Please Refresh the page and try agian!! An error occurred while deleting the vehicle.`,
        severity: "error",
      });
    }
  };

  const filteredVehicles = vehicles
    ? vehicles.filter((vehicle) =>
        selectedFilter === "all" ? true : vehicle.type === selectedFilter
      )
    : [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          Vehicle Management Dashboard
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={selectedFilter}
              label="Filter"
              onChange={(e) => setSelectedFilter(e.target.value)}
              startAdornment={<FaFilter style={{ marginRight: 8 }} />}
            >
              <MenuItem value="all">All Vehicles</MenuItem>
              <MenuItem value="bike">Bikes</MenuItem>
              <MenuItem value="car">Cars</MenuItem>
              <MenuItem value="van">Vans</MenuItem>
              <MenuItem value="truck">Trucks</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {showForm && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Vehicle
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Vehicle Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Vehicle Type"
                  >
                    <MenuItem value="bike">Bike</MenuItem>
                    <MenuItem value="car">Car</MenuItem>
                    <MenuItem value="van">Van</MenuItem>
                    <MenuItem value="truck">Truck</MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography variant="caption" color="error">
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Plate Number"
                  name="plateNumber"
                  value={formData.plateNumber}
                  onChange={handleInputChange}
                  error={!!errors.plateNumber}
                  helperText={errors.plateNumber}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  error={!!errors.model}
                  helperText={errors.model}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  error={!!errors.capacity}
                  helperText={errors.capacity}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.available}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          available: e.target.checked,
                        }))
                      }
                      name="available"
                    />
                  }
                  label="Available"
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Add Vehicle
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowForm(false)}
                    size="large"
                  >
                    Cancel
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}

      <Grid container spacing={3}>
        {!showForm && (
          <Grid item xs={12} sm={6} md={4}>
            <AddVehicleCard onClick={() => setShowForm(true)}>
              <Box sx={{ textAlign: "center" }}>
                <IconButton
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  <FaPlus />
                </IconButton>
                <Typography sx={{ mt: 2 }}>Add New Vehicle</Typography>
              </Box>
            </AddVehicleCard>
          </Grid>
        )}

        {filteredVehicles.map((vehicle) => {
          const VehicleIcon = vehicleIcons[vehicle.type];
          return (
            <Grid item xs={12} sm={6} md={4} key={vehicle._id}>
              {/* {console.log(vehicle)} */}
              <StyledCard>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          backgroundColor: vehicleColors[vehicle.type],
                          borderRadius: "50%",
                          p: 1,
                          color: "white",
                        }}
                      >
                        <VehicleIcon size={24} />
                      </Box>
                      <Chip
                        label={
                          vehicle.type.charAt(0).toUpperCase() +
                          vehicle.type.slice(1)
                        }
                        size="small"
                        sx={{
                          backgroundColor: vehicleColors[vehicle.type] + "20",
                        }}
                      />
                    </Box>
                    <Tooltip title="Delete Vehicle">
                      <IconButton
                        onClick={() => handleDelete(vehicle._id)}
                        color="error"
                        size="small"
                      >
                        <FaTrash />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {vehicle.model}
                  </Typography>
                  <Typography color="textSecondary">
                    Plate Number: {vehicle.plateNumber}
                  </Typography>
                  {vehicle.driver && (
                    <Typography color="textSecondary">
                      Assigned Driver: {vehicle.driver.name} |{" "}
                      {String(vehicle.driver.phone).slice(2)}
                    </Typography>
                  )}
                  <Typography color="textSecondary">
                    Capacity: {vehicle.capacity} persons  
                  </Typography>
                  <Chip
                    label={vehicle.availability ? "Available" : "Not Available"}
                    color={vehicle.availability ? "success" : "error"}
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this vehicle?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VehicleManagementDashboard;
