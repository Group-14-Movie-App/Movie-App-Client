import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllGroups.css";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [userID, setUserID] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Tracks if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setIsLoggedIn(false); // Mark user as not logged in
      return;
    }

    setUserID(user.userid); // Set logged-in user's ID

    const fetchGroups = async () => {
      try {
        const groupsResponse = await fetch("http://localhost:5000/all-groups", {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
        });

        if (!groupsResponse.ok) {
          throw new Error("Failed to fetch groups.");
        }

        const groupsData = await groupsResponse.json();
        setGroups(groupsData);

        const statusesResponse = await fetch(
          `http://localhost:5000/all-groups/user-status?userID=${user.userid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the JWT token
            },
          }
        );        

        if (!statusesResponse.ok) {
          throw new Error("Failed to fetch user statuses.");
        }

        const statusesData = await statusesResponse.json();

        // Map statuses by groupID for easy lookup
        const statusMap = {};
        statusesData.forEach(({ groupid, status }) => {
          statusMap[groupid] = status;
        });
        setStatuses(statusMap);
      } catch (error) {
        console.error("Error fetching groups or statuses:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleCancelRequest = async (groupID) => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    try {
      const response = await fetch(
        `http://localhost:5000/all-groups/${groupID}/cancel-request`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
          body: JSON.stringify({ userID }),
        }
      );

      if (response.ok) {
        alert("Join request canceled.");
        setStatuses((prev) => ({ ...prev, [groupID]: "none" }));
      } else {
        alert("Failed to cancel request. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling join request:", error);
    }
  };

  const handleRemoveFromGroup = async (groupID) => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    try {
      const response = await fetch(
        `http://localhost:5000/groups/${groupID}/remove-member`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the JWT token
          },
          body: JSON.stringify({ userID }),
        }
      );

      if (response.ok) {
        alert("Removed from group.");
        setStatuses((prev) => ({ ...prev, [groupID]: "none" }));
      } else {
        alert("Failed to remove from group. Please try again.");
      }
    } catch (error) {
      console.error("Error removing from group:", error);
    }
  };

  const handleSendRequest = async (groupID) => {
    const token = localStorage.getItem("token"); // Retrieve the JWT token

    try {
      const response = await fetch("http://localhost:5000/group-join-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({ userID, groupID }),
      });

      if (response.ok) {
        alert("Join request sent successfully.");
        setStatuses((prev) => ({ ...prev, [groupID]: "pending" }));
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send join request.");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };

  const handleViewGroup = (groupID) => {
    navigate(`/other-group-details/${groupID}`);
  };

  return (
    <div className="all-groups-container">
      {!isLoggedIn ? (
        <p>
          Please{" "}
          <button
            className="login-link"
            onClick={() => navigate("/sign-in-page")}
          >
            log in
          </button>{" "}
          to view public community group chats.
        </p>
      ) : groups.length > 0 ? (
        groups
          .filter((group) => group.ownerid !== userID) // Exclude user's own groups
          .map((group) => (
            <div key={group.groupid} className="group-card">
              <h3>{group.groupname}</h3>
              <p>{group.description}</p>
              <div className="group-card-buttons">
                <button
                  className="group-btn group-view-btn"
                  onClick={() => handleViewGroup(group.groupid)}
                >
                  View Group
                </button>
                {statuses[group.groupid] === "member" ? (
                  <button
                    className="group-btn group-remove-btn"
                    onClick={() => handleRemoveFromGroup(group.groupid)}
                  >
                    Remove from Group
                  </button>
                ) : statuses[group.groupid] === "pending" ? (
                  <button
                    className="group-btn group-cancel-btn"
                    onClick={() => handleCancelRequest(group.groupid)}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <button
                    className="group-btn group-send-btn"
                    onClick={() => handleSendRequest(group.groupid)}
                  >
                    Send Request
                  </button>
                )}
              </div>
            </div>
          ))
      ) : (
        <p>No groups available to join.</p>
      )}
    </div>
  );
}

export default AllGroups;
