import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL } from "../utils/base-url/baseURL";
import { Icon } from "@iconify/react/dist/iconify.js";

const ForgetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showcnfrmPassword, setcnfrmShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglecnfrmPasswordVisibility = () => {
    setcnfrmShowPassword(!showcnfrmPassword);
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    otp: Yup.string().required("OTP is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "password must  be at least 6 charachter"),
    confirmPassword: Yup.string()
      .required("Confirm Password is required")
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage("");
    setSuccessMessage("");

    const { email, otp, newPassword } = values; // Destructure required fields
    const requestBody = {
      email,
      otp,
      new_password: newPassword, // Rename to match API field
    };

    try {
      setFormData(values); // Store form data in the state
      const response = await axios.post(
        `${baseURL}/reset-password-otp`,
        requestBody
      );

      if (response.data?.message) {
        setSuccessMessage(
          response.data.message || "Password reset successful."
        );
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/login");
        }, 1000);
      } else {
        setErrorMessage("Failed to reset the password. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "An error occurred. Please try again."
      );
    } finally {
      setSubmitting(false);
      resetForm();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 lg:mb-10">
      <div className="flex flex-col justify-center items-center text-center w-[80%] md:w-full pb-3">
        <img
          src="/logo.png"
          alt="MemoCompanion Robot"
          className="mb-4 w-20 mt-4 lg:mt-0 lg:w-40"
        />
        <div>
          <h1 className="text-2xl mb-4 lg:text-3xl text-[#003366] font-bold">
            Reset Password
          </h1>
          <p className="italic">Enter the required details to reset password</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row rounded-lg w-full pt-2 max-w-[90%] lg:max-w-[70%] lg:justify-center">
        <div className="lg:w-[70%] pt-8 pb-4 px-16 bg-white rounded-lg mb-10 lg:mb-0">
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Email Field */}
                <div className="mb-4">
                  <label className="block text-[18px] font-semibold mb-2">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 text-[18px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* OTP Field */}
                <div className="mb-4">
                  <label className="block text-[18px] font-semibold mb-2">
                    OTP
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    className="w-full px-4 py-2 text-[18px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* New Password Field */}
                <div className="mb-4">
                  <label className="block text-[18px] font-semibold mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="newPassword"
                      placeholder="Enter New Password"
                      className="w-full px-4 py-2 text-[18px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        className="text-blue-500 text-xl"
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="newPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label className="block text-[18px] font-semibold mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showcnfrmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full px-4 py-2 text-[18px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <span
                      onClick={togglecnfrmPasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    >
                      <Icon
                        icon={
                          showcnfrmPassword
                            ? "solar:eye-bold"
                            : "solar:eye-closed-bold"
                        }
                        className="text-blue-500 text-xl"
                      />
                    </span>
                  </div>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-500 text-center mb-4">
                    {errorMessage}
                  </p>
                )}
                {successMessage && (
                  <p className="text-green-500 text-center mb-4">
                    {successMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#003366] text-white py-3 rounded-lg font-semibold text-[20px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="text-center text-[16px] mt-4">
            <a
              href="/login"
              className="text-[#1A7D5B] font-semibold hover:underline"
            >
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
