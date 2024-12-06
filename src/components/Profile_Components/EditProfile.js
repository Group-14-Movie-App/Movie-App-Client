import React, { useState } from "react";
import './EditProfile.css';

const EditProfile = ({ userDetails, setIsEditing, onProfileUpdate }) => {
  const [formDetails, setFormDetails] = useState(userDetails);

  // List of cities
  const cities = [
    'Espoo',
    'Helsinki',
    'Vantaa',
    'Jyväskylä',
    'Kuopio',
    'Lahti',
    'Lappeenranta',
    'Oulu',
    'Pori',
    'Tampere',
    'Turku',
    'Raisio',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const handleSave = async () => {
    try {
      if (!formDetails.userid) {
        alert("User ID is missing. Please try again.");
        return;
      }

      const response = await fetch(`http://localhost:5000/profile/${formDetails.userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formDetails.email,
          firstName: formDetails.firstname,
          lastName: formDetails.lastname,
          city: formDetails.city,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();

        // Update localStorage with the new user details
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Call the parent callback to update the userDetails state
        onProfileUpdate(updatedUser);
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.message || "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={formDetails.firstname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={formDetails.lastname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formDetails.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>City:</label>
          <select
            name="city"
            value={formDetails.city}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select a city
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-profile-buttons">
          <button type="button" onClick={handleSave}>
            Save
          </button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
