// src/AppContext.js
import React, { createContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Define the data or functions you want to share, like a `trackDriver` function
  const [booking, setbooking] = useState(null);

  return (
    <AppContext.Provider value={{ booking, setbooking }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
