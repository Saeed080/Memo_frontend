import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Ensure toast is configured in your app
import { baseURL } from "../utils/base-url/baseURL";
import { useUser } from "../context/UserContext";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const location = useLocation(); // Get the current location
  const { setUser } = useUser();
  const navigate = useNavigate();
  const param = useParams();

  // Check for query parameters and show toast if "verified" exists
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log("as", queryParams?.size);
    if (queryParams?.size === 1) {
      toast.success("Email verified succesfully , please log in");
    }
  }, [location.search]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${baseURL}/login`, {
        email: values.email,
        password: values.password,
      });

      if (response.status === 200) {
        const userData = response.data;
        setUser(userData?.body);

        if (userData) {
          Cookies.set("user", true);
          Cookies.set("name", userData?.body?.name);
          Cookies.set("dob", userData?.body?.dob);
          Cookies.set("marraid", userData?.body?.marital_status);
          Cookies.set("userId", userData?.body?.id);
          Cookies.set("gender", userData?.body?.ai_gender);
          Cookies.set("infoTaken", userData?.body?.info_taken);
          Cookies.set("onboarded", userData?.body?.onboarded);
        }

        const onboarded = userData?.body?.onboarded;

        if (onboarded) {
          window.location.href = "/chat-bot";
        } else {
          window.location.href = "/info";
        }
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col items-center text-center w-full max-w-sm sm:max-w-md">
        <img
          src="/logo.png"
          alt="MemoCompanion Robot"
          className="mb-3 w-16 sm:w-20 md:w-40"
        />
        <h1 className="lg:text-[36px] sm:text-2xl text-[#1D9C71] font-bold">
          MemoCompanion
        </h1>
        <p className="italic text-xs sm:text-sm mt-1">
          Log in to continue with your diaries and memory exercises
        </p>
      </div>
      <div className="w-full max-w-sm sm:max-w-md mt-4">
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-1">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="John@gmail.com"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      <Icon
                        icon={
                          showPassword
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                        className="text-blue-500 text-lg sm:text-xl"
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs sm:text-sm mt-1"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-center text-xs sm:text-sm">
                    {errorMessage}
                  </p>
                )}

                <div className="flex justify-end">
                  <a
                    href="/forget-password"
                    className="text-blue-500 hover:underline text-xs sm:text-sm"
                  >
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  // className="w-full bg-[#003366] text-white py-2 sm:py-3 rounded-lg font-semibold text-[22px] sm:text-base"
                  className="w-full bg-[#003366] text-white py-3 rounded-lg font-semibold text-[22px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                </button>

                <div className="text-center text-xs sm:text-sm mt-3">
                  <p>
                    Don't have an account?{" "}
                    <a
                      href="signup"
                      className="text-[#1A7D5B] font-semibold hover:underline"
                    >
                      Sign Up
                    </a>
                  </p>
                  <p className="mt-1 text-[#003366]">Research Study</p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default LoginForm;
