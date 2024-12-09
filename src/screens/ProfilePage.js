import React, { useEffect, useState } from "react";
import Favorites from "../components/Profile_Components/Favorites";
import "./screensStyles/ProfilePage.css";
import EditProfile from "../components/Profile_Components/EditProfile";
import ErrorMessage from "../screens/error_file/ErrorMessage";

function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Added state to toggle the Edit mode
  const [isLoggedIn, setIsLoggedIn] = useState(true); // State to track if user is logged in

  useEffect(() => {
    // Fetch user details from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserDetails(user);
    } else {
      setIsLoggedIn(false); // Mark user as not logged in
    }
  }, []);

  const handleProfileUpdate = (updatedDetails) => {
    setUserDetails(updatedDetails); // Update the userDetails state
    setIsEditing(false); // Exit edit mode
  };

  const handleDeleteProfile = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/profile/${userDetails.userid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`, // Add token in Authorization header
          },
        }
      );

      if (response.ok) {
        alert("Profile deleted successfully.");
        localStorage.removeItem("user"); // Remove user data
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/"; // Redirect to home or login page
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.message || "Failed to delete profile.");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("An error occurred while deleting the profile.");
    }
  };

  // If user is not logged in, show error message
  if (!isLoggedIn) {
    return <ErrorMessage message="You need to log in to access the profile page." />;
  }

  // If userDetails are still being fetched, show loading
  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      {isEditing ? (
        <EditProfile
          userDetails={userDetails}
          setIsEditing={setIsEditing}
          onProfileUpdate={handleProfileUpdate} // Pass callback to update state
        />
      ) : (
        <div className="profile-card">
          <div className="profile-picture">
            <img
              src={`https://api.dicebear.com/5.x/initials/svg?seed=${userDetails.firstname}-${userDetails.lastname}`}
              alt="Profile Avatar"
            />
          </div>
          <div className="profile-details">
            <h2>{`${userDetails.firstname} ${userDetails.lastname}`}</h2>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>City:</strong> {userDetails.city}
            </p>
          </div>
          <div className="profile-actions">
            <button
              className="edit-profile-button"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className="delete-profile-button"
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>
      )}
      <div className="favorites-container">
        <h3>Your Favorite Groups</h3>
        <Favorites
          userID={userDetails.userid}
          showEditAndDeleteButtons={true} // Allow editing and deleting for favorite groups
        />
      </div>
    </div>
  );
}

export default ProfilePage;
