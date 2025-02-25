import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseURL } from "../utils/base-url/baseURL";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Setting = () => {
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading] = useState(false);

  const userId = Cookies.get("userId");

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Old password is required."),
    newPassword: Yup.string()
      .required("New password is required.")
      .min(6, "Password must be at least 6 characters "),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required."),
  });

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setApiError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post(`${baseURL}/reset-password`, {
        user_id: userId,
        old_password: values.oldPassword,
        new_password: values.newPassword,
      });

      if (response.data?.message) {
        setSuccessMessage("Password updated successfully.");
        resetForm();
        // Hide the success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setApiError(response.data?.message || "Failed to update password.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || "An error occurred.";
      setApiError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen lg:h-[100%]">
      {/* Top Bar */}
      <div className="pl-16 bg-gradient-to-r w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-2 mx-auto text-white font-medium flex justify-center items-center">
        <p>
          Just a reminder: I'm an AI companion chatbot here to support you, not
          a real person!
        </p>
      </div>
      {/* ------------- */}
      <div className="flex-1 pt-8 scroll-ml-20 bg-white flex flex-col relative rounded-xl">
        <div className="flex justify-start items-start min-h-screen p-10">
          <div className="bg-white flex flex-col items-start rounded-md p-6 w-full max-w-md">
            <h2 className="text-2xl text-center mb-6 text-gray-800">
              Change your{" "}
              <span className="font-bold text-[#003568]">Password</span> here!
            </h2>

            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleChange }) => (
                <Form className="w-full">
                  <div className="mb-4">
                    <label
                      className="block text-gray-600 font-bold mb-2"
                      htmlFor="oldPassword"
                    >
                      Old Password
                    </label>
                    <Field
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter old password"
                    />
                    <ErrorMessage
                      name="oldPassword"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-600 font-bold mb-2"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <Field
                        type={showPasswords.newPassword ? "text" : "password"}
                        name="newPassword"
                        id="newPassword"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600 hover:text-gray-800"
                        onClick={() => togglePasswordVisibility("newPassword")}
                      >
                        <Icon
                          icon={
                            showPasswords.newPassword
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                          className="text-blue-500 text-xl"
                        />
                      </button>
                    </div>
                    <ErrorMessage
                      name="newPassword"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-gray-600 font-bold mb-2"
                      htmlFor="confirmPassword"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Field
                        type={
                          showPasswords.confirmPassword ? "text" : "password"
                        }
                        name="confirmPassword"
                        id="confirmPassword"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2/4 transform -translate-y-2/4 text-gray-600 hover:text-gray-800"
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      >
                        <Icon
                          icon={
                            showPasswords.confirmPassword
                              ? "solar:eye-bold"
                              : "solar:eye-closed-bold"
                          }
                          className="text-blue-500 text-xl"
                        />
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  {apiError && <p className="text-red-500 mb-4">{apiError}</p>}
                  {successMessage && (
                    <p className="text-green-500 mb-4">{successMessage}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#1a7d5d] hover:bg-[#1a7d5ec5] text-white py-2 px-4 rounded-md font-medium transition mt-2"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
