import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseURL } from "../utils/base-url/baseURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const userId = Cookies.get("userId");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Edit mode state
  const [updatedInfo, setUpdatedInfo] = useState({}); // State for updated info
  const [updating, setUpdating] = useState(false); // Loading state for update

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResponse = await fetch(`${baseURL}/users?user_id=${userId}`);
        const data = await userResponse.json();
        setUserInfo(data?.body);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [userId]);

  console.log(userInfo);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedInfo({ ...updatedInfo, [name]: value });
    console.log(name, value);
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      // Validate required fields
      if (!userId) {
        toast.error("User ID is required.");
        return;
      }

      setUpdating(true);
      // Construct query parameters
      const params = new URLSearchParams();
      params.append("user_id", userId);
      if (updatedInfo.name) params.append("name", updatedInfo.name);
      if (updatedInfo.birthplace)
        params.append("birthplace", updatedInfo.birthplace);
      if (updatedInfo.dob) params.append("dob", updatedInfo.dob);
      if (updatedInfo.ai_gender)
        params.append("ai_gender", updatedInfo.ai_gender);
      const formattedDob = updatedInfo.dob.toString();
      console.log(formattedDob);

      try {
        const response = await axios.put(
          `${baseURL}/update/user_profile?user_id=${userId}&name=${updatedInfo.name}&birthplace=${updatedInfo.birthplace}&dob=${formattedDob}&ai_gender=${updatedInfo.ai_gender}&marital_status=${updatedInfo.marital_status}`,
          {},
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Refresh the profile data
          const userResponse = await fetch(
            `${baseURL}/users?user_id=${userId}`
          );
          const data = await userResponse.json();
          setUserInfo(data?.body);
          setIsEditing(false); // Switch back to non-edit mode
          toast.success("Profile updated successfully!");
        } else {
          throw new Error("Failed to update profile.");
        }
      } catch (err) {
        console.error("Error updating profile data:", err);
        toast.error("Failed to update profile.");
      } finally {
        setUpdating(false);
      }
    } else {
      setUpdatedInfo(userInfo); // Initialize updatedInfo with current user data
      setIsEditing(true); // Enter edit mode
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen lg:h-[100%] ">
        <div className="pl-16 bg-gradient-to-r w-full lg:w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
          <p>Your Profile</p>
        </div>
        <div className="flex-1 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
          Loading....
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen lg:h-[100%] ">
        <div className="pl-16 bg-gradient-to-r w-full lg:w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
          <p>Your Profile</p>
        </div>
        <div className="flex-1 pt-8 px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
          <div className="w-full py-4 px-6">
            <h1 className="text-red-500 text-3xl font-bold">Error</h1>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:h-[100%] ">
      {/* Top Bar */}
      <div className="pl-16 bg-gradient-to-r w-full lg:w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
        <p>Your Profile</p>
      </div>

      {/* Content */}
      <div className="flex-1  px-4 overflow-y-auto scroll-ml-20 bg-white flex flex-col relative rounded-xl">
        <div className="w-full py-4 ">
          <div className="">
            <h1 className="font-semibold">Welcome to Your Profile!</h1>
            <h4 className="mt-2">
              Here you can view the personal details you have provided. If you
              need to update any information, simply click the "Edit" button.
            </h4>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white p-6  w-full">
            <form className="space-y-4">
              {/* Name Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={
                      isEditing ? updatedInfo?.name || "" : userInfo?.name || ""
                    }
                    placeholder="Name not available"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInfo?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* DOB and Marital Status in Same Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date of Birth Input */}
                <div>
                  <label
                    htmlFor="dob"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={
                      isEditing ? updatedInfo?.dob || "" : userInfo?.dob || ""
                    }
                    placeholder="DOB not available"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* =========== */}

                {/* Marital Status Input */}

                <div>
                  <label
                    htmlFor="birthplace"
                    className="block text-gray-600 font-medium mb-2"
                  >
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    id="birthplace"
                    name="birthplace"
                    value={
                      isEditing
                        ? updatedInfo?.birthplace || ""
                        : userInfo?.birthplace || ""
                    }
                    placeholder="Birth Place is not available"
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {/* ======= */}
              </div>
              {/* place of birth */}
              <div>
                <label
                  htmlFor="marital_status"
                  className="block text-gray-600 font-medium mb-2"
                >
                  Marital Status
                </label>
                <input
                  type="text"
                  id="marital_status"
                  name="marital_status"
                  value={
                    isEditing
                      ? updatedInfo?.marital_status || ""
                      : userInfo?.marital_status || ""
                  }
                  placeholder="Marital Status not available"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* AI Gender Dropdown */}
              <div>
                <label
                  htmlFor="ai_gender"
                  className="block text-gray-600 font-medium mb-2"
                >
                  AI Gender
                </label>
                <select
                  id="ai_gender"
                  name="ai_gender"
                  value={
                    isEditing
                      ? updatedInfo?.ai_gender || ""
                      : userInfo?.ai_gender || ""
                  }
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  {/* <option value="Female">Female</option> */}

                  <option value="female">Female</option>
                </select>
              </div>
            </form>
            <button
              onClick={handleEditToggle}
              disabled={updating}
              className={`px-8 py-2 mt-4 rounded-lg ${
                isEditing
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {updating ? "Updating..." : isEditing ? "Update" : "Edit"}
            </button>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Profile;
