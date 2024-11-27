import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyGroups.css";

function MyGroups() {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      try {
        const response = await fetch(`http://localhost:5000/my-groups?userID=${user.userid}`);
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

    try {
      const response = await fetch(`http://localhost:5000/my-groups/${groupID}`, {
        method: "DELETE",
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
        {groups.length > 0 ? (
          groups.map((group) => (
            <div key={group.groupid} className="group-card">
              <h3>{group.groupname}</h3>
              <p>{group.description || "No description provided."}</p>
              <div className="group-actions">
                <button className="btn btn-primary" onClick={() => handleViewGroup(group)}>
                  View
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteGroup(group.groupid)}>
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
