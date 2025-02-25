// import React, { useState } from "react";
// import { Icon } from "@iconify/react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { baseURL } from "../../utils/base-url/baseURL";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// // Validation schema using Yup
// const validationSchema = Yup.object({
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   password: Yup.string()
//     .required("Password is required")
//     .min(6, "password must  be at least 6 charachter"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password")], "Passwords must match")
//     .required("Confirm your password"),
//   ai_gender: Yup.string().required("Select your AI companion"),
// });

// const SignUpForm = () => {
//   const [showPassword, setShowPassword] = useState({
//     password: false,
//     confirmPassword: false,
//   });

//   const togglePasswordVisibility = (field) => {
//     setShowPassword({
//       ...showPassword,
//       [field]: !showPassword[field],
//     });
//   };
//   const navigate = useNavigate();
//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const response = await axios.post(`${baseURL}/signup`, {
//         email: values.email,
//         password: values.password,
//         ai_gender: values.ai_gender,
//       });

//       console.log(response);
//       if (response.status === 200) {
//         console.log("as", response?.data?.body?.message);
//         toast("Account created successfully!");
//         toast(response?.body?.message);
//         resetForm();
//         navigate("/login");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         alert("Account already exists!");

//         resetForm();
//       } else {
//         console.error("Signup error", error);
//         alert("Error occurred during signup");
//       }
//     }
//     setSubmitting(false);
//   };

//   const initialValues = {
//     email: "",
//     password: "",
//     confirmPassword: "",
//     ai_gender: "",
//   };

//   return (
//     <div className="flex flex-col text-primary1 items-center justify-center min-h-screen bg-gray-100">
//       <img
//         className="absolute left-2 lg:left-10 top-1 lg:top-10 w-14 lg:w-40"
//         src="/logo.png"
//       />
//       <div className="text-center mb-4">
//         <h2 className="text-[36px] text-[#1D9C71] font-bold">MemoCompanion</h2>
//       </div>
//       <div className="bg-white py-6 px-12 rounded-lg shadow-lg md:max-w-[40%] max-w-[95%] w-full">
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ values, setFieldValue, isSubmitting }) => (
//             <Form>
//               <div className="mb-4">
//                 <label className="block text-[20px] font-semibold mb-2">
//                   Email Address
//                 </label>
//                 <Field
//                   type="email"
//                   name="email"
//                   placeholder="Enter Your Email Address"
//                   className="w-full px-4 py-3 text-[18px] text-[#8D8D8D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />
//                 <ErrorMessage
//                   name="email"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-[20px] font-semibold mb-2">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <Field
//                     type={showPassword.password ? "text" : "password"}
//                     name="password"
//                     placeholder="Enter Your Password"
//                     className="w-full px-4 py-3 text-[18px] text-[#8D8D8D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   />
//                   <span
//                     onClick={() => togglePasswordVisibility("password")}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                   >
//                     <Icon
//                       icon={
//                         showPassword.password
//                           ? "solar:eye-bold"
//                           : "solar:eye-closed-bold"
//                       }
//                       style={{ color: "#1727A9", fontSize: "24px" }}
//                     />
//                   </span>
//                 </div>
//                 <ErrorMessage
//                   name="password"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-[20px] font-semibold mb-2">
//                   Confirm Password
//                 </label>
//                 <div className="relative">
//                   <Field
//                     type={showPassword.confirmPassword ? "text" : "password"}
//                     name="confirmPassword"
//                     placeholder="Re-Enter Your Password"
//                     className="w-full px-4 py-3 text-[18px] text-[#8D8D8D] border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   />
//                   <span
//                     onClick={() => togglePasswordVisibility("confirmPassword")}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
//                   >
//                     <Icon
//                       icon={
//                         showPassword.confirmPassword
//                           ? "solar:eye-bold"
//                           : "solar:eye-closed-bold"
//                       }
//                       style={{ color: "#1727A9", fontSize: "24px" }}
//                     />
//                   </span>
//                 </div>
//                 <ErrorMessage
//                   name="confirmPassword"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               {/* ============== */}
//               {/* AI Companion Selection */}
//               <div className="mb-8">
//                 <label className="block text-[17px] font-semibold mb-2">
//                   Choose the Gender of Your AI MemoCompanion
//                 </label>
//                 <div className="flex items-center border-1 gap-11 border rounded-lg py-3 px-4">
//                   <div>
//                     <label className="flex items-center space-x-2 cursor-pointer">
//                       <Field
//                         type="radio"
//                         name="ai_gender"
//                         value="male"
//                         className="form-radio"
//                       />
//                       <img src="/male.svg" alt="Male" className="h-10 w-10" />
//                       <span className="font-medium text-sm">Male</span>
//                     </label>
//                   </div>
//                   <div>
//                     <label className="flex items-center space-x-2 cursor-pointer">
//                       <Field
//                         type="radio"
//                         name="ai_gender"
//                         value="female"
//                         className="form-radio text-pink-600"
//                       />
//                       <img src="/grr.png" alt="Female" className="h-10 w-10" />
//                       <span className="font-medium text-sm">Female</span>
//                     </label>
//                   </div>
//                 </div>
//                 <ErrorMessage
//                   name="ai_gender"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div>

//               {/* AI Companion Selection */}
//               {/* <div className="mb-8">
//                 <label className="block text-[20px] font-semibold mb-2">
//                   Choose the Gender of Your AI MemoCompanion
//                 </label>
//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     className={`flex flex-1 items-center justify-center space-x-4 px-8 py-1 border rounded-lg ${
//                       values.ai_gender === "female"
//                         ? "border-blue-500 bg-gray-100"
//                         : "border-gray-300"
//                     }`}
//                     onClick={() => setFieldValue("ai_gender", "female")}
//                   >
//                     <img src="/female.svg" alt="Female" className="h-12 w-12" />
//                     <span className="font-normal text-[20px]">Female</span>
//                   </button>
//                   <button
//                     type="button"
//                     className={`flex flex-1 items-center justify-center space-x-4 px-8 py-1 border rounded-lg ${
//                       values.ai_gender === "male"
//                         ? "border-blue-500 bg-gray-100"
//                         : "border-gray-300"
//                     }`}
//                     onClick={() => setFieldValue("ai_gender", "male")}
//                   >
//                     <img src="/male.svg" alt="Male" className="h-12 w-12" />
//                     <span className="font-normal text-[20px]">Male</span>
//                   </button>
//                 </div>
//                 <ErrorMessage
//                   name="ai_gender"
//                   component="div"
//                   className="text-red-500 text-sm mt-1"
//                 />
//               </div> */}

//               <button
//                 type="submit"
//                 className="w-full bg-[#1A7D5B] text-white py-3 rounded-lg font-semibold text-[22px]"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Signing Up..." : "Sign Up"}
//               </button>

//               <div className="text-center text-[18px] mt-4">
//                 <p>
//                   Already have an account?{" "}
//                   <a
//                     href="/login"
//                     className="text-[#1520A6] font-semibold hover:underline"
//                   >
//                     Log In
//                   </a>
//                 </p>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default SignUpForm;

// ====

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseURL } from "../../utils/base-url/baseURL";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  ai_gender: Yup.string().required("Select your AI companion"),
});

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const [showResendButton, setShowResendButton] = useState(false);
  const togglePasswordVisibility = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(`${baseURL}/signup`, {
        email: values.email,
        password: values.password,
        ai_gender: values.ai_gender,
      });

      if (response.status === 200) {
        if (response?.data?.body?.message) {
          toast.info(
            "Please verify your email to activate your account. Check your inbox for the verification link and click on it to get started"
          );
        }

        setShowResendButton(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error("Account already exists!");
      } else {
        toast.error(error.response || "Error occurred during signup");
      }
    }
    setSubmitting(false);
  };

  const handleResendVerification = async (email) => {
    try {
      const response = await axios.post(
        `${baseURL}/resend-verification?email=${encodeURIComponent(email)}`,
        null, // Use null as there's no body in your request
        {
          headers: {
            accept: "application/json", // Ensure headers match your curl command
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          response?.data?.body?.message ||
            "Verification email resent successfully!"
        );
      }
    } catch (error) {
      console.error(error?.response?.data); // Log the error for debugging
      toast.error(
        error?.response?.data?.detail || "Failed to resend verification email."
      );
    }
  };

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
    ai_gender: "",
  };

  return (
    <div className="flex flex-col text-primary1 items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
      <img
        className="absolute left-2 lg:left-40 top-1 lg:top-10 w-14 lg:w-40"
        src="/logo.png"
      />
      <div className="text-center mb-4">
        <h2 className="text-[36px] text-[#1D9C71] font-bold">MemoCompanion</h2>
      </div>
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg w-[95%] md:w-[50%] lg:w-[40%]">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-[20px] font-semibold mb-2">
                  Email Address
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address"
                  className="w-full px-4 py-3 text-[18px]  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[20px] font-semibold mb-2">
                  Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword.password ? "text" : "password"}
                    name="password"
                    placeholder="Enter Your Password"
                    className="w-full px-4 py-3 text-[18px]  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    <Icon
                      icon={
                        showPassword.password
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                      style={{ color: "#1727A9", fontSize: "24px" }}
                    />
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-[20px] font-semibold mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Field
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-Enter Your Password"
                    className="w-full px-4 py-3 text-[18px]  border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <span
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  >
                    <Icon
                      icon={
                        showPassword.confirmPassword
                          ? "solar:eye-bold"
                          : "solar:eye-closed-bold"
                      }
                      style={{ color: "#1727A9", fontSize: "24px" }}
                    />
                  </span>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-8">
                <label className="block text-[17px] font-semibold mb-2">
                  Choose the Gender of Your AI MemoCompanion
                </label>
                <div className="flex items-center border rounded-lg py-3 px-4 gap-8">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Field
                      type="radio"
                      name="ai_gender"
                      value="male"
                      className="form-radio"
                    />
                    <img src="/male.svg" alt="Male" className="h-10 w-10" />
                    <span className="font-medium text-sm">Male</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Field
                      type="radio"
                      name="ai_gender"
                      value="female"
                      className="form-radio text-pink-600"
                    />
                    <img src="/female.svg" alt="Female" className="h-10 w-10" />
                    <span className="font-medium text-sm">Female</span>
                  </label>
                </div>
                <ErrorMessage
                  name="ai_gender"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1A7D5B] text-white py-3 rounded-lg font-semibold text-[22px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>

              {showResendButton && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleResendVerification(values.email)}
                    className="text-blue-500 font-semibold hover:underline"
                  >
                    Resend Verification Email
                  </button>
                </div>
              )}

              <div className="text-center text-[18px] mt-4">
                <p>
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-[#1520A6] font-semibold hover:underline"
                  >
                    Log In
                  </a>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        closeOnClick={false}
        hideProgressBar
      />
    </div>
  );
};

export default SignUpForm;
