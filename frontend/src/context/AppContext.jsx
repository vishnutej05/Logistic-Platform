import React, { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [driverStatus, setDriverStatus] = useState("pending"); // default status is 'pending'
  const [booking, setBooking] = useState(null); // Adjusted variable name

  return (
    <AppContext.Provider
      value={{ driverStatus, setDriverStatus, booking, setBooking }} // Correctly passing setBooking
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
