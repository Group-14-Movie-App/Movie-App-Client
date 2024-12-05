import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css"; // Optional CSS for styling

function Favorites({ userID }) {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [editingGroup, setEditingGroup] = useState(null); // Track group being edited
  const [editGroupName, setEditGroupName] = useState(""); // Name of the group being edited
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
    navigate(`/favorites/${favoriteID}`, { state: { groupName } });
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group.favoriteid);
    setEditGroupName(group.name);
  };

  const handleSaveEditGroup = () => {
    fetch(`http://localhost:5000/favorites/${editingGroup}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editGroupName }),
    })
      .then((response) => response.json())
      .then((data) => {
        setFavoriteGroups(
          favoriteGroups.map((group) =>
            group.favoriteid === editingGroup ? { ...group, name: editGroupName } : group
          )
        );
        setEditingGroup(null);
        setEditGroupName("");
        setFeedback("Group updated successfully!");
      })
      .catch((error) => {
        console.error("Error editing group:", error);
        setFeedback("Failed to update group. Try again.");
      });
  };

  const handleDeleteGroup = (favoriteID) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    fetch(`http://localhost:5000/favorites/${favoriteID}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setFavoriteGroups(favoriteGroups.filter((group) => group.favoriteid !== favoriteID));
          setFeedback("Group deleted successfully!");
        } else {
          setFeedback("Failed to delete group. Try again.");
        }
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
        setFeedback("Failed to delete group. Try again.");
      });
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
