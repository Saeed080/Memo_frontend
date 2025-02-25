// import React, { useState, useEffect } from "react";
// import { useUser } from "../context/UserContext";

// const useAuth = () => {
//   const { user } = useUser();
//   console.log("User data:", user);

//   // Check if the user ID exists and initialize isAuthenticated
//   const [isAuthenticated, setIsAuthenticated] = useState(
//     !!user?.userData?.body?.id
//   );

//   console.log("Check user ID:", user?.userData?.body?.id);

//   // Effect to update isAuthenticated whenever user changes
//   useEffect(() => {
//     setIsAuthenticated(!!user?.userData?.body?.id);
//   }, [user]); // Dependency array ensures it runs whenever `user` changes

//   const handleChangeAuthenticated = (data) => {
//     setIsAuthenticated(data);
//   };

//   return {
//     isAuthenticated,
//     handleChangeAuthenticated,
//   };
// };

// export default useAuth;
