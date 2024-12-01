import React, { useState } from 'react';

const EditProfile = ({ userDetails, setIsEditing }) => {
  const [formDetails, setFormDetails] = useState(userDetails);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const handleSave = () => {
    // Save the updated details (e.g., update localStorage or make an API call)
    localStorage.setItem("user", JSON.stringify(formDetails));
    setIsEditing(false);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstname" value={formDetails.firstname} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastname" value={formDetails.lastname} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formDetails.email} onChange={handleChange} />
        </div>
        <div>
          <label>City:</label>
          <input type="text" name="city" value={formDetails.city} onChange={handleChange} />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
      </form>
    </div>
  );
};

export default EditProfile;