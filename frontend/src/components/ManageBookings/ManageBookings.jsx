import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  TextField,
  MenuItem,
  Container,
  Paper,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  FaUser,
  FaCar,
  FaMapMarkerAlt,
  FaFilter,
  FaPhone,
  FaStar,
  FaClock,
} from "react-icons/fa";
import site from "../common/API";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: "16px",
  background: "linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
  },
}));

const StatusChip = styled(Chip)(({ status }) => ({
  backgroundColor:
    status === "completed"
      ? "#4caf50"
      : status === "in-progress"
      ? "#2196f3"
      : "#ff9800",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "8px",
  padding: "4px 8px",
}));

const StyledAvatar = styled(Avatar)({
  width: 60,
  height: 60,
  border: "3px solid #fff",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const InfoBox = styled(Box)({
  background: "rgba(0,0,0,0.02)",
  borderRadius: "8px",
  padding: "12px",
  marginBottom: "16px",
});

// Function to get token from cookies
const getToken = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  return token || "";
};

const BookingsDashboard = () => {
  const [bookings, setBookings] = useState([]); // State to store bookings fetched from API
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  // Fetch bookings from API when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await site.get("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        console.log(response.data);
        setBookings(response.data || []); // Ensure response data is an array
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []); // Empty dependency array means it runs once on mount

  const handleFilterChange = (event) => {
    setLoading(true);
    setFilter(event.target.value);
    setTimeout(() => setLoading(false), 500);
  };

  const filteredBookings = bookings.filter((booking) =>
    filter === "all" ? true : booking.status === filter
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: "16px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
            color="primary"
          >
            Bookings Dashboard
          </Typography>
          <TextField
            select
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
            }}
            InputProps={{
              startAdornment: <FaFilter style={{ marginRight: 8 }} />,
            }}
          >
            <MenuItem value="all">All Bookings</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredBookings.map((booking) => (
              <Grid item xs={12} md={6} lg={4} key={booking._id}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <StyledAvatar
                        src={booking.userImage || ""} // Use optional chaining
                        alt={booking.user.name || "User"}
                      />
                      <Box ml={2} flex={1}>
                        <Typography
                          variant="h6"
                          component="div"
                          fontWeight="bold"
                        >
                          {booking.user.name || "Unknown User"}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <StatusChip
                            label={booking.status || "unknown"}
                            status={booking.status}
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            <FaStar
                              style={{ color: "#ffd700", marginRight: 4 }}
                            />
                            {booking.rating || "N/A"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <InfoBox>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <FaUser style={{ marginRight: 8 }} /> Driver:{" "}
                        {booking.driver.name || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <FaCar style={{ marginRight: 8 }} /> Vehicle:{" "}
                        {booking.vehicle.model || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                      >
                        <FaPhone style={{ marginRight: 8 }} />{" "}
                        {String(booking.driver.phone).slice(2) || "N/A"}
                      </Typography>
                    </InfoBox>

                    <InfoBox>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <FaMapMarkerAlt
                          style={{ marginRight: 8, color: "#4caf50" }}
                        />{" "}
                        Pickup: {booking.pickupLocation.address || "N/A"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                      >
                        <FaMapMarkerAlt
                          style={{ marginRight: 8, color: "#f44336" }}
                        />{" "}
                        Dropoff: {booking.dropoffLocation.address || "N/A"}
                      </Typography>
                    </InfoBox>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={2}
                    >
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        ₹{booking.price || "N/A"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" color="text.secondary">
                          <FaMapMarkerAlt style={{ marginRight: 4 }} />
                          {booking.distance || "N/A"} km
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <FaClock style={{ marginRight: 4 }} />
                          {/* {booking.createdAt || "N/A"} */}
                          {(() => {
                            const start = new Date(booking.createdAt);
                            const end = new Date(booking.updatedAt);
                            const durationMs = end - start;

                            // Calculate hours and minutes
                            const hours = Math.floor(
                              durationMs / (1000 * 60 * 60)
                            );
                            const minutes = Math.floor(
                              (durationMs % (1000 * 60 * 60)) / (1000 * 60)
                            );

                            return `${hours}h ${minutes}m` || "N/A";
                          })()}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Payment Status:{" "}
                      {booking.paymentStatus === "pending"
                        ? "Not Paid"
                        : "Done" || "N/A"}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default BookingsDashboard;
