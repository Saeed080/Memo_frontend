import React, { createContext, useState, useContext } from "react";

// Create the UserContext
const UserContext = createContext();

// Create a custom hook for easier access to the context
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider to wrap the app and provide global state
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the user information here
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State for authentication

  // Function to update authentication status
  const handleAuthenticationChange = (data) => {
    setIsAuthenticated(data);
  };

  // console.log("User:", user);
  // console.log("Authenticated:", isAuthenticated);

  const value = {
    user, // The current user
    setUser, // Function to update user
    isAuthenticated, // The authentication state
    handleAuthenticationChange, // Function to change authentication state
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
