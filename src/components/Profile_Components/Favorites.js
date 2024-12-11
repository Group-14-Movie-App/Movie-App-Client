import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css"; // Optional CSS for styling

// Define the base URL for the backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function Favorites({ userID }) {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingGroup, setEditingGroup] = useState(null); // Track group being edited
  const [editGroupName, setEditGroupName] = useState(""); // Name of the group being edited
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // Fetch the token
    if (!userID || !token) return;
  
    // Fetch favorite groups from the backend
    fetch(`${BASE_URL}/favorites?userID=${userID}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => setFavoriteGroups(data))
      .catch((error) => console.error("Error fetching favorite groups:", error));
  }, [userID]);
  
  const handleAddGroup = async () => {
    const token = localStorage.getItem("token"); // Fetch the token
    if (!newGroupName.trim()) {
      setFeedback("Group name cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify({
          userID,
          name: newGroupName,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setFavoriteGroups([...favoriteGroups, data]);
        setNewGroupName("");
        setFeedback("Group added successfully!");
      } else {
        const errorData = await response.json();
        setFeedback(errorData.message || "Failed to add group.");
      }
    } catch (error) {
      console.error("Error adding group:", error);
      setFeedback("An error occurred while adding the group.");
    }
  };
  
  

  const handleGroupClick = (favoriteID, groupName) => {
    navigate(`/favorites/${favoriteID}`, { state: { groupName } });
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.favoriteid);
    setEditGroupName(group.name);
  };

  const handleSaveEditGroup = async () => {
    const token = localStorage.getItem("token"); // Fetch the token
  
    try {
      const response = await fetch(`${BASE_URL}/favorites/${editingGroup}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token
        },
        body: JSON.stringify({ name: editGroupName }),
      });
  
      if (response.ok) {
        setFavoriteGroups(
          favoriteGroups.map((group) =>
            group.favoriteid === editingGroup ? { ...group, name: editGroupName } : group
          )
        );
        setEditingGroup(null);
        setEditGroupName("");
        setFeedback("Group updated successfully!");
      } else {
        const errorData = await response.json();
        setFeedback(errorData.message || "Failed to update group.");
      }
    } catch (error) {
      console.error("Error editing group:", error);
      setFeedback("An error occurred while editing the group.");
    }
  };
  

  const handleDeleteGroup = async (favoriteID) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
  
    const token = localStorage.getItem("token"); // Fetch the token
  
    try {
      const response = await fetch(`${BASE_URL}/favorites/${favoriteID}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token
        },
      });
  
      if (response.ok) {
        setFavoriteGroups(favoriteGroups.filter((group) => group.favoriteid !== favoriteID));
        setFeedback("Group deleted successfully!");
      } else {
        const errorData = await response.json();
        setFeedback(errorData.message || "Failed to delete group.");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      setFeedback("An error occurred while deleting the group.");
    }
  };
  

  return (
    <div className="favorites-container">
      <h2>Your Favorite Groups</h2>
      <div className="favorites-list">
        {favoriteGroups.length > 0 ? (
          favoriteGroups.map((group) => (
            <div key={group.favoriteid} className="favorite-group">
              {editingGroup === group.favoriteid ? (
                <>
                  <input
                    type="text"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                  />
                  <button onClick={handleSaveEditGroup}>Save</button>
                  <button onClick={() => setEditingGroup(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <h3 onClick={() => handleGroupClick(group.favoriteid, group.name)}>
                    {group.name}
                  </h3>
                  <button onClick={() => handleEditGroup(group)}>Edit</button>
                  <button onClick={() => handleDeleteGroup(group.favoriteid)}>Delete</button>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No favorite groups yet. Create one below!</p>
        )}
      </div>

      <div className="add-group-form">
        <h3>Add a New Group</h3>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button onClick={handleAddGroup}>Add Group</button>
      </div>
      {feedback && <p className="feedback-message">{feedback}</p>}
    </div>
  );
}

export default Favorites;
