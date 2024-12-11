import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyGroups.css";

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Tracks if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token"); // Retrieve JWT token

      if (!user || !token) {
        setIsLoggedIn(false); // Mark user as not logged in
        return;
      }

      try {
        const response = await fetch(
          `https://movieapp-backend1.onrender.com/my-groups?userID=${user.userid}`,
          {
            headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch groups.");
        }

        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleDeleteGroup = async (groupID) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    const token = localStorage.getItem("token"); // Retrieve JWT token

    try {
      const response = await fetch(`https://movieapp-backend1.onrender.com/my-groups/${groupID}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
      });

      if (response.ok) {
        alert("Group deleted successfully.");
        setGroups(groups.filter((group) => group.groupid !== groupID));
      } else {
        alert("Failed to delete group. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleViewGroup = (group) => {
    navigate(`/my-group-details/${group.groupid}`, { state: { group } });
  };

  return (
    <div className="my-groups">
      <h2>My Groups</h2>
      <div className="group-cards">
        {!isLoggedIn ? (
          <p>
            Please{" "}
            <button
              className="login-link"
              onClick={() => navigate("/sign-in-page")}
            >
              log in
            </button>{" "}
            to create and view your groups.
          </p>
        ) : groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.groupid} className="group-card">
              <h3>{group.groupname}</h3>
              <p>{group.description || "No description provided."}</p>
              <div className="group-actions">
                <button
                  className="group-action-btn view-btn"
                  onClick={() => handleViewGroup(group)}
                >
                  View
                </button>
                <button
                  className="group-action-btn delete-btn"
                  onClick={() => handleDeleteGroup(group.groupid)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>You have not created any groups yet.</p>
        )}
      </div>
    </div>
  );
}

export default MyGroups;
