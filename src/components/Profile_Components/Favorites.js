import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css"; // Optional CSS for styling

function Favorites({ userID }) {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userID) return;

    // Fetch favorite groups from the backend
    fetch(`http://localhost:5000/favorites?userID=${userID}`)
      .then((response) => response.json())
      .then((data) => setFavoriteGroups(data))
      .catch((error) => console.error("Error fetching favorite groups:", error));
  }, [userID]);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      setFeedback("Group name cannot be empty.");
      return;
    }

    fetch("http://localhost:5000/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userID,
        name: newGroupName,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFavoriteGroups([...favoriteGroups, data]);
        setNewGroupName("");
        setFeedback("Group added successfully!");
      })
      .catch((error) => {
        console.error("Error adding group:", error);
        setFeedback("Failed to add group. Try again.");
      });
  };

  const handleGroupClick = (favoriteID, groupName) => {
    // Navigate to the FavoriteGroupDetails page
    navigate(`/favorites/${favoriteID}`, { state: { groupName } });
  };

  return (
    <div className="favorites-container">
      <h2>Your Favorite Groups</h2>
      <div className="favorites-list">
        {favoriteGroups.length > 0 ? (
          favoriteGroups.map((group) => (
            <div
              key={group.favoriteid}
              className="favorite-group"
              onClick={() => handleGroupClick(group.favoriteid, group.name)}
            >
              <h3>{group.name}</h3>
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
