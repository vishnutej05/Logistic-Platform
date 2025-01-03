# Logistics Platform

# Live https://shiftly.netlify.app/

## Overview

Efficient and reliable transportation of goods is essential in today's fast-paced world. However, traditional logistics solutions often lack transparency, real-time tracking, and user flexibility. The Logistics Platform addresses these challenges by providing a comprehensive, user-centric solution for on-demand transportation. Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), it empowers users to:

## Features

- **User-Centric Booking**: Users can directly choose their preferred driver, providing more control over their transportation experience.
- **Real-Time Location Sharing (Google Maps API)**: Track the assigned driver’s location in real-time as they move, ensuring transparency and improving user satisfaction.
- **Driver and Fleet Management**: Admins can easily manage the fleet of drivers and vehicles, update statuses, and monitor availability.
- **Booking Workflow**: From booking creation to job completion, the system ensures efficient tracking of job statuses and driver updates.
- **Role-Based Access Control**: Different roles (admin, driver, user) ensure secure access and permission management for data and features.
- **JWT Authentication**: Secure authentication for all users via JSON Web Tokens (JWT).
- **Responsive Design**: The frontend is fully responsive, ensuring seamless access on both desktop and mobile devices.

## Tech Stack

- **Frontend**: React.js, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Token)
- **API Integration**: Google Maps API for real-time tracking
- **Styling**: CSS, React Bootstrap (optional)

## API Endpoints

The platform provides a variety of APIs categorized by role and functionality:

### **Driver Routes**
All routes for drivers are accessible via `/api/driver`. Example operations include:
- Viewing available bookings
- Accepting a booking
- Fetching current bookings
- Logging out of the session

### **User Routes**
All user-specific routes are accessible via `/api/user`. Example operations include:
- Registering and logging in
- Creating bookings
- Viewing booking history

### **Admin Routes**
Admin-specific routes are accessible via `/api/admin`. Admin operations include:
- Managing fleet (vehicles and drivers)
- Viewing analytics
- Overseeing all platform activities

### **Global Routes**
- `/api/login`: Handles authentication-related routes login.
- `/api/register`: Handles authentication-related routes registration.
  

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/logistics-platform.git

2. Navigate to the project directory:
   
   ```bash
   cd logistics-platform

3. Install the dependencies:
   
   ```bash
   npm install   
   
4. Set up the backend:
- Set up environment variables: Create a .env file in the backend folder and add your environment variables (e.g., database connection string, JWT secret).
   ```bash
   cd backend
   npm install
   
4. Run the application:
  - Frontend
    ```bash
     cd backend
     npm start
  - Backend
    ```bash
     cd backend
     nodemon app.js.


