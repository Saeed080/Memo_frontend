import SignUp from "../pages/auth/signup";
import Login from "../pages/Login";

export const OpenRoutes = [
  {
    element: <Login />,
    path: "/login",
  },
  {
    element: <SignUp />,
    path: "signup",
  },
];
