import React, { useEffect, useState } from "react";
import "./screensStyles/ProfilePage.css"; // Create this CSS file for styling

function ProfilePage() {
  const [userDetails, setUserDetails] = useState(null);

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
      <h1 className="profile-title">User Profile</h1>
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
      </div>
    </div>
  );
}

export default ProfilePage;
