import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { baseURL } from "../utils/base-url/baseURL";

import axios from "axios";

const ForgetPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post(`${baseURL}/forgot-password`, {
        email: values.email,
      });

      if (response.data?.message) {
        setSuccessMessage(
          response.data?.message || "Password reset link sent successfully."
        );
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/otp");
        }, 1000);
      } else {
        setErrorMessage("Failed to send the reset link. Please try again.");
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
          className=" mb-4 w-20 mt-4 lg:mt-0 lg:w-40"
        />
        <div>
          <h1 className="text-2xl mb-4 lg:text-3xl text-[#003366] font-bold">
            Forget Password
          </h1>
          <p className="italic">
            Please enter your email to receive a One-Time Password (OTP)
          </p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row rounded-lg w-full pt-2 max-w-[90%] lg:max-w-[70%] lg:justify-center">
        <div className="lg:w-[70%] pt-8 pb-4 px-16 bg-white rounded-lg mb-10 lg:mb-0">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-4">
                  <label className="block text-[18px] font-semibold mb-2">
                    Email Address
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="John@gmail.com"
                    className="w-full px-4 py-2 text-[18px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <ErrorMessage
                    name="email"
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
                  {isSubmitting ? "sending..." : "Send OTP"}
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
