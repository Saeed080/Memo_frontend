import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/SideBar";
import ChatBot from "./pages/Chatbot";
import OpenLayout from "./components/layouts/OpenLayout";
import { OpenRoutes } from "./routes/open-routes";
// import useAuth from "./hooks/auth";

import LoginForm from "./pages/Login";
import SignUpForm from "./pages/auth/signup";
import InfoGather from "./pages/InfoGather";
import WithSidebarLayout from "./components/layouts/WithSidebarLayout";
import { useUser } from "./context/UserContext";
import Cookies from "js-cookie";
import Profile from "./pages/Profile";
import ChatHistory from "./pages/ChatHistory";
import Setting from "./pages/Setting";
import Help from "./pages/Help";
import ForgetPassword from "./pages/ForgetPassword";
import OtpPage from "./pages/OtpPage";
import Memory from "./pages/Memory";
import Privacy from "./pages/Privacy";
const App = () => {
  // const { isAuthenticated } = useUser();

  const isAuthenticated = Cookies.get("user") ? true : false;
  return (
    <Router>
      <Routes>
        {/* Redirect based on auth status */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/chat-bot" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Open Routes without sidebar */}
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp" element={<OtpPage />} />

        <Route
          path="/info"
          element={
            isAuthenticated ? (
              <WithSidebarLayout>
                <InfoGather />
              </WithSidebarLayout>
            ) : (
              <Navigate to={"/login"} replace />
            )
          }
        />
        <Route
          path="/memory"
          element={
            isAuthenticated ? (
              <WithSidebarLayout>
                <Memory />
              </WithSidebarLayout>
            ) : (
              <Navigate to={"/login"} replace />
            )
          }
        />
        <Route
          path="/privacy-policy"
          element={
            isAuthenticated ? (
              <WithSidebarLayout>
                <Privacy />
              </WithSidebarLayout>
            ) : (
              <Navigate to={"/login"} replace />
            )
          }
        />

        {/* All routes that require a sidebar */}
        <Route
          path="/chat-bot"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <ChatBot />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />

        <Route
          path="/profile"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <Profile />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />

        <Route
          path="/conversation"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <ChatHistory />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />

        <Route
          path="/settings"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <Setting />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />
        <Route
          path="/support"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <Help />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />
        <Route
          path="/suport"
          element={
            isAuthenticated ? ( // Only allow access if authenticated
              <WithSidebarLayout>
                <Help />
              </WithSidebarLayout>
            ) : (
              <Navigate to="/login" replace /> // Redirect to login if not authenticated
            )
          }
        />

        {/* Render other open routes */}
        {OpenRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
