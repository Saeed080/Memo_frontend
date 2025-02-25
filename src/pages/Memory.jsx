import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { baseURL } from "../utils/base-url/baseURL";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShimmerCard = () => (
  <div className="relative flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-md shimmer w-full">
    <div className="w-full h-52 bg-gray-300 rounded-md shimmer-element"></div>
    <div className="w-full h-4 bg-gray-300 rounded-md shimmer-element"></div>
    <div className="w-full h-4 bg-gray-300 rounded-md shimmer-element"></div>
    <div className="absolute top-2 right-2 flex space-x-2">
      <div className="w-10 h-10 bg-gray-300 rounded-full shimmer-element"></div>
      <div className="w-10 h-10 bg-gray-300 rounded-full shimmer-element"></div>
    </div>
  </div>
);

const Memory = () => {
  const userId = Cookies.get("userId");
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({
    person_name: "",
    relationship: "",
    person_picture: null,
  });
  const [updatingPhotoId, setUpdatingPhotoId] = useState(null);
  const [deletingPhotoIds, setDeletingPhotoIds] = useState([]);

  // States for adding a new memory
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    person_name: "",
    relationship: "",
    person_picture: null,
  });
  const [addingMemory, setAddingMemory] = useState(false);
  const [addError, setAddError] = useState(null);

  // Extracted fetchProfile function using useCallback for memoization
  const fetchProfile = useCallback(async () => {
    if (userId) {
      setLoading(true);
      setError(null);
      try {
        const profileResponse = await axios.get(
          `${baseURL}/fetch/person_record/${userId}`
        );
        setProfileData(profileResponse.data.data);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Please Upload Photo");
      } finally {
        setLoading(false);
      }
    } else {
      setError("User ID not found.");
      setLoading(false);
    }
  }, [userId]);

  // Initial data fetch
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleDelete = async (photoId) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    setDeletingPhotoIds((prev) => [...prev, photoId]);

    try {
      await axios.delete(`${baseURL}/delete/person_record/${photoId}`);
      toast.success("Photo deleted successfully!");
      // Re-fetch the profile data after deletion
      await fetchProfile();
    } catch (err) {
      console.error("Error deleting photo:", err);
      toast.error("Failed to delete the photo. Please try again.");
    } finally {
      setDeletingPhotoIds((prev) => prev.filter((id) => id !== photoId));
    }
  };

  const handleEdit = (photo) => {
    setEditingPhotoId(photo._id);
    setEditedDetails({
      person_name: photo.person_name || "",
      relationship: photo.relationship || "",
      person_picture: null,
    });
  };

  const handleCancelEdit = () => {
    setEditingPhotoId(null);
    setEditedDetails({
      person_name: "",
      relationship: "",
      person_picture: null,
    });
  };

  const handleSave = async (photo) => {
    setUpdatingPhotoId(photo._id);
    try {
      const queryParams = new URLSearchParams({
        person_name: editedDetails.person_name.trim(),
        relationship: editedDetails.relationship,
      }).toString();

      let bodyData = null;
      let headers = {};

      if (editedDetails.person_picture) {
        const formData = new FormData();
        formData.append("file", editedDetails.person_picture);
        bodyData = formData;
        headers["Content-Type"] = "multipart/form-data";
      }

      await axios.put(
        `${baseURL}/update/person_record/${photo._id}?${queryParams}`,
        bodyData,
        { headers }
      );

      toast.success("Photo updated successfully!");
      setEditingPhotoId(null);
      setEditedDetails({
        person_name: "",
        relationship: "",
        person_picture: null,
      });

      // Re-fetch the profile data after update
      await fetchProfile();
    } catch (err) {
      console.error("Error uploading photo:", err?.response?.data);
      toast.error(
        err.response?.data?.detail ||
          "Failed to update the photo. Please try again."
      );
    } finally {
      setUpdatingPhotoId(null);
    }
  };

  const handleFileChange = (e, photo) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setEditedDetails((prev) => ({
        ...prev,
        person_picture: file,
        preview: previewURL,
      }));
    }
  };

  // Handlers for adding a new memory
  const handleAddMemoryChange = (e) => {
    const { name, value } = e.target;
    setNewMemory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMemoryFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMemory((prev) => ({
        ...prev,
        person_picture: file,
      }));
    }
  };

  const handleAddMemorySubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !newMemory.person_name.trim() ||
      !newMemory.relationship.trim() ||
      !newMemory.person_picture
    ) {
      toast.error("All fields are mandatory.");
      return;
    }

    setAddingMemory(true);
    setAddError(null);

    try {
      const formData = new FormData();
      formData.append("file", newMemory.person_picture);

      const queryParams = new URLSearchParams({
        user_id: userId,
        person_name: newMemory.person_name.trim(),
        relationship: newMemory.relationship.trim(),
      }).toString();

      await axios.post(
        `${baseURL}/create/person_record?${queryParams}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Photo added successfully!");
      setShowAddForm(false);
      setNewMemory({
        person_name: "",
        relationship: "",
        person_picture: null,
      });

      // Re-fetch the profile data after adding
      await fetchProfile();
    } catch (err) {
      console.error("Error adding Photo:", err?.response?.data);
      toast.error(
        err.response?.data?.detail ||
          "Failed to add the Photo. Please try again."
      );
      setAddError(
        err.response?.data?.detail ||
          "Failed to add the Photo. Please try again."
      );
    } finally {
      setAddingMemory(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen lg:h-full">
        <div className="pl-16 bg-gradient-to-r w-full lg:w-auto from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
          <p>Manage Photos</p>
        </div>
        <div className="flex-1 pt-8 px-4 overflow-y-auto bg-white flex flex-col relative rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ShimmerCard key={index} />
            ))}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen lg:h-full">
        <div className="pl-16 bg-gradient-to-r from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
          <p>Your Photo Gallery</p>
        </div>
        <div className="flex-1 pt-8 px-4 overflow-y-auto bg-white flex flex-col relative rounded-xl">
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition-colors focus:outline-none"
            >
              {showAddForm ? "Cancel" : "add new photo"}
            </button>
          </div>
          {showAddForm && (
            <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
              <h2 className="text-lg font-semibold mb-4">Add a New Photo</h2>
              <form onSubmit={handleAddMemorySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="newPersonName"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Person Name
                  </label>
                  <input
                    type="text"
                    id="newPersonName"
                    name="person_name"
                    value={newMemory.person_name}
                    onChange={handleAddMemoryChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={addingMemory}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newRelationship"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Relationship
                  </label>
                  <input
                    type="text"
                    id="newRelationship"
                    name="relationship"
                    value={newMemory.relationship}
                    onChange={handleAddMemoryChange}
                    required
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    disabled={addingMemory}
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPersonPicture"
                    className="block text-gray-700 font-medium mb-1"
                  >
                    Upload Image
                  </label>
                  <input
                    type="file"
                    id="newPersonPicture"
                    // accept="image/*"
                    accept=".png, .jpg, .jpeg"
                    onChange={handleAddMemoryFileChange}
                    required
                    className="w-full"
                    disabled={addingMemory}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-colors focus:outline-none flex items-center"
                    disabled={addingMemory}
                  >
                    {addingMemory && (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    )}
                    {addingMemory ? "Adding..." : "Add Photo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition-colors focus:outline-none"
                    disabled={addingMemory}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          <div className="flex justify-center items-center h-full text-red-500">
            {error}
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:h-full transition-opacity duration-500">
      <div className="pl-16 w-full lg:w-auto  bg-gradient-to-r from-[#1FD899] to-[#0F6447] lg:rounded-t-3xl lg:px-10 py-5 lg:py-2 me-auto text-white font-medium flex justify-center items-center">
        <p>Manage Photos</p>
      </div>
      <div className="flex-1 py-4 px-4 overflow-y-auto bg-white flex flex-col relative rounded-xl">
        <div className="">
          <h1 className="font-semibold">Welcome to the Manage Photos page!</h1>
          <h4 className="lg:mt-2">
            Here you can view and manage the photos you've uploaded. Each photo
            is used in memory exercises to help you recall people's names and
            shared experiences.
          </h4>
          <h4 className="lg:mt-2">
            To add a new photo, simply click the "Add Photo" button. To edit an
            existing photo, use the "Edit" button associated with it. You can
            replace the photo or change details such as names and relationships.
            To delete a photo, select the "Delete" button associated with it.
          </h4>
        </div>
        {/* Add a Memory Button */}

        {/* Add Memory Form */}
        {showAddForm && (
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Add a New Photo</h2>
            <form onSubmit={handleAddMemorySubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="newPersonName"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Person Name
                </label>
                <input
                  type="text"
                  id="newPersonName"
                  name="person_name"
                  value={newMemory.person_name}
                  onChange={handleAddMemoryChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={addingMemory}
                />
              </div>
              <div>
                <label
                  htmlFor="newRelationship"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Relationship
                </label>
                <input
                  type="text"
                  id="newRelationship"
                  name="relationship"
                  value={newMemory.relationship}
                  onChange={handleAddMemoryChange}
                  required
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  disabled={addingMemory}
                />
              </div>
              <div>
                <label
                  htmlFor="newPersonPicture"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Upload Image
                </label>
                <input
                  type="file"
                  id="newPersonPicture"
                  accept="image/*"
                  onChange={handleAddMemoryFileChange}
                  required
                  className="w-full"
                  disabled={addingMemory}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-colors focus:outline-none flex items-center"
                  disabled={addingMemory}
                >
                  {addingMemory && (
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  )}
                  {addingMemory ? "Adding..." : "Add Photo"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition-colors focus:outline-none"
                  disabled={addingMemory}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="w-full py-4">
          {/* <h1 className="text-xl px-4 font-semibold mb-4 text-gray-800">
            Your Photo Gallery
          </h1> */}
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition-colors focus:outline-none"
            >
              {showAddForm ? "Cancel" : "Add a Photo"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.length > 0 ? (
              profileData.map((photo) => {
                const isEditing = editingPhotoId === photo._id;
                const isUpdating = updatingPhotoId === photo._id;
                const isDeleting = deletingPhotoIds.includes(photo._id);

                return (
                  <div
                    key={photo._id}
                    className={`relative flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-md transition-shadow transform ${
                      isUpdating || isDeleting
                        ? "opacity-50 pointer-events-none"
                        : "hover:shadow-lg"
                    }`}
                  >
                    {(isUpdating || isDeleting) && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
                        <ShimmerCard />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSave(photo)}
                            className="bg-green-500 text-white rounded-full h-10 w-10 shadow transform transition-transform hover:scale-110 focus:outline-none flex items-center justify-center"
                            title="Save"
                            disabled={isUpdating}
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 text-white rounded-full h-10 w-10 shadow transform transition-transform hover:scale-110 focus:outline-none flex items-center justify-center"
                            title="Cancel"
                            disabled={isUpdating}
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(photo)}
                            className="bg-blue-500 text-white rounded-full h-10 w-10 shadow transform transition-transform hover:scale-110 focus:outline-none flex items-center justify-center"
                            title="Edit"
                            disabled={isUpdating || isDeleting}
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(photo._id)}
                            className="bg-red-500 text-white rounded-full h-10 w-10 shadow transform transition-transform hover:scale-110 focus:outline-none flex items-center justify-center"
                            title="Delete"
                            disabled={isUpdating || isDeleting}
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </div>

                    {isEditing ? (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, photo)}
                        className="w-full mb-4"
                        disabled={isUpdating}
                      />
                    ) : (
                      <img
                        src={photo.person_picture || ""}
                        alt={photo.person_name || "Placeholder"}
                        className="w-full h-52 object-cover rounded-md shadow"
                      />
                    )}

                    <div className="w-full transition-opacity duration-500">
                      <label
                        htmlFor={`photoName${photo._id}`}
                        className="block text-gray-600 font-medium mb-2"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id={`photoName${photo._id}`}
                        value={
                          isEditing
                            ? editedDetails.person_name
                            : photo.person_name || ""
                        }
                        onChange={(e) =>
                          setEditedDetails((prev) => ({
                            ...prev,
                            person_name: e.target.value,
                          }))
                        }
                        disabled={!isEditing || isUpdating}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none transition-all ${
                          isEditing ? "ring-blue-500" : ""
                        }`}
                      />
                    </div>
                    <div className="w-full transition-opacity duration-500">
                      <label
                        htmlFor={`relationship${photo._id}`}
                        className="block text-gray-600 font-medium mb-2"
                      >
                        Relationship
                      </label>
                      <input
                        type="text"
                        id={`relationship${photo._id}`}
                        value={
                          isEditing
                            ? editedDetails.relationship
                            : photo.relationship || ""
                        }
                        onChange={(e) =>
                          setEditedDetails((prev) => ({
                            ...prev,
                            relationship: e.target.value,
                          }))
                        }
                        disabled={!isEditing || isUpdating}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none transition-all ${
                          isEditing ? "ring-blue-500" : ""
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-red-700">Please upload a Photo.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Memory;
