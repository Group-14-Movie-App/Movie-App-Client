import React, { useEffect, useState } from "react";
import Favorites from "../components/Profile_Components/Favorites";
import "./screensStyles/ProfilePage.css";
import EditProfile from "../components/Profile_Components/EditProfile";

function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Added state to toggle the Edit mode

  useEffect(() => {
    // Simulating fetching user details from localStorage or an API
    const user = JSON.parse(localStorage.getItem("user")); // Assuming the user is stored in localStorage after login
    setUserDetails(user);
  }, []);

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      {isEditing ? (
        <EditProfile userDetails={userDetails} setIsEditing={setIsEditing} />
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
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>City:</strong> {userDetails.city}</p>
          </div>
          <div>
            <button className="edit-profile-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
          </div>
        </div>
      )}
      {/* Render the Favorites Component */}
      <Favorites userID={userDetails.userid} />
    </div>
  );
}

export default ProfilePage;
