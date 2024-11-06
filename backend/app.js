const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http"); // Import http to create a server
const { Server } = require("socket.io"); // Import Socket.IO

dotenv.config();

// Import Routes
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");
const fleetRoutes = require("./routes/fleet");
const driverRoutes = require("./routes/drivers");
const vehicleRoutes = require("./routes/vehicle");
const adminRoutes = require("./routes/admin");
// Middleware for authentication
const auth = require("./middleware/userauth");
const { verifyAdmin } = require("./middleware/verifyAdmin");
// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from all origins (you can restrict this to your frontend's domain)
  },
});

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes Middleware
app.use("/api/auth", authRoutes);
app.use("/api/bookings", auth, bookingRoutes);
app.use("/api/fleet", auth, fleetRoutes);
app.use("/api/driver", auth, driverRoutes);
app.use("/api/vehicle", auth, vehicleRoutes);
app.use("/api/admin", verifyAdmin, adminRoutes);

app.get("/", async (req, res) => {
  res.send("Welcome to ther server !");
});
// Socket.IO for real-time tracking
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Listen for location updates from drivers
  socket.on("driverLocationUpdate", (locationData) => {
    console.log("Driver Location Update:", locationData);

    // Broadcast location to users tracking the driver
    io.emit("trackDriver", locationData);
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
