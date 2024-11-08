import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Container,
  Paper,
  CircularProgress,
  Button,
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

const mockBookings = [
  {
    id: 1,
    userName: "John Doe",
    driverName: "Mike Smith",
    vehicle: "Toyota Camry",
    status: "completed",
    price: "$45.00",
    distance: "12.5 km",
    pickupAddress: "123 Main St, City",
    dropoffAddress: "456 Park Ave, City",
    userImage: "images.unsplash.com/photo-1633332755192-727a05c4013d",
    rating: 4.8,
    duration: "25 mins",
    phoneNumber: "+1 234-567-8900",
  },
  {
    id: 2,
    userName: "Alice Johnson",
    driverName: "David Wilson",
    vehicle: "Honda Civic",
    status: "in-progress",
    price: "$32.50",
    distance: "8.2 km",
    pickupAddress: "789 Oak Rd, City",
    dropoffAddress: "321 Pine St, City",
    userImage: "images.unsplash.com/photo-1494790108377-be9c29b29330",
    rating: 4.5,
    duration: "18 mins",
    phoneNumber: "+1 234-567-8901",
  },
  {
    id: 3,
    userName: "Sarah Williams",
    driverName: "Robert Brown",
    vehicle: "Tesla Model 3",
    status: "pending",
    price: "$55.75",
    distance: "15.8 km",
    pickupAddress: "147 Elm St, City",
    dropoffAddress: "258 Maple Ave, City",
    userImage: "images.unsplash.com/photo-1534528741775-53994a69daeb",
    rating: 4.9,
    duration: "30 mins",
    phoneNumber: "+1 234-567-8902",
  },
];

const BookingsDashboard = () => {
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (event) => {
    setLoading(true);
    setFilter(event.target.value);
    setTimeout(() => setLoading(false), 500);
  };

  const filteredBookings = mockBookings.filter((booking) =>
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
              <Grid item xs={12} md={6} lg={4} key={booking.id}>
                <StyledCard>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={3}>
                      <StyledAvatar
                        src={`https://${booking.userImage}`}
                        alt={booking.userName}
                      />
                      <Box ml={2} flex={1}>
                        <Typography
                          variant="h6"
                          component="div"
                          fontWeight="bold"
                        >
                          {booking.userName}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={1}
                          mt={0.5}
                        >
                          <StatusChip
                            label={booking.status}
                            status={booking.status}
                            size="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            <FaStar
                              style={{ color: "#ffd700", marginRight: 4 }}
                            />
                            {booking.rating}
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
                        {booking.driverName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                        mb={1}
                      >
                        <FaCar style={{ marginRight: 8 }} /> Vehicle:{" "}
                        {booking.vehicle}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        display="flex"
                        alignItems="center"
                      >
                        <FaPhone style={{ marginRight: 8 }} />{" "}
                        {booking.phoneNumber}
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
                        Pickup: {booking.pickupAddress}
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
                        Dropoff: {booking.dropoffAddress}
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
                        {booking.price}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body2" color="text.secondary">
                          <FaMapMarkerAlt style={{ marginRight: 4 }} />
                          {booking.distance}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <FaClock style={{ marginRight: 4 }} />
                          {booking.duration}
                        </Typography>
                      </Box>
                    </Box>
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
