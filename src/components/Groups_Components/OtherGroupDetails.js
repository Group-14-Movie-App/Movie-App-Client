import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OtherGroupDetails.css";

// Define the base URL for the backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function OtherGroupDetails() {
  const { groupID } = useParams();
  const navigate = useNavigate();
  const [groupDetails, setGroupDetails] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState(null); // "member", "pending", or null
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Retrieve JWT token
  
    if (user && token) {
      setUserID(user.userid);
  
      const fetchGroupDetails = async () => {
        try {
          const groupResponse = await fetch(
            `${BASE_URL}/other-groups/${groupID}`,
            { headers: { Authorization: `Bearer ${token}` } } // Add Authorization header
          );
          if (!groupResponse.ok) throw new Error("Failed to fetch group details.");
          const groupData = await groupResponse.json();
          setGroupDetails(groupData);
  
          const statusResponse = await fetch(
            `${BASE_URL}/other-groups/${groupID}/status?userID=${user.userid}`,
            { headers: { Authorization: `Bearer ${token}` } } // Add Authorization header
          );
          if (!statusResponse.ok) throw new Error("Failed to fetch relationship status.");
          const statusData = await statusResponse.json();
          setRelationshipStatus(statusData.status);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchGroupDetails();
    } else {
      alert("Please log in to view group details.");
    }
  }, [groupID]);
  
  const handleSendRequest = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token
    try {
      const response = await fetch(`${BASE_URL}/group-join-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify({ userID, groupID }),
      });
  
      if (response.ok) {
        alert("Join request sent successfully.");
        setRelationshipStatus("pending");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to send join request.");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };
  
  const handleRemoveMembership = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token
    try {
      const response = await fetch(
        `${BASE_URL}/groups/${groupID}/remove-member`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({ userID }),
        }
      );
  
      if (response.ok) {
        alert("You have been removed from the group.");
        setRelationshipStatus(null);
      } else {
        alert("Failed to remove from the group. Please try again.");
      }
    } catch (error) {
      console.error("Error removing membership:", error);
    }
  };
  
  const handleCancelRequest = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token
    try {
      const response = await fetch(
        `${BASE_URL}/other-groups/${groupID}/cancel-request`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
          body: JSON.stringify({ userID }),
        }
      );
  
      if (response.ok) {
        alert("Join request canceled.");
        setRelationshipStatus(null);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to cancel request.");
      }
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };
  

  const handleGoToGroupPosts = () => {
    if (relationshipStatus === "member") {
      navigate(`/group-posts/${groupID}`, {
        state: { group: groupDetails }, // Pass the group details
      });
    } else if (relationshipStatus === "pending") {
      alert("Your join request is still pending. You cannot view group posts yet.");
    } else {
      alert("You need to be a member of this group to view posts.");
    }
  };
  

  if (!groupDetails) {
    return <p>Loading group details...</p>;
  }

  return (
    <div className="other-group-details">
      <h1>{groupDetails.groupname}</h1>
      <p>{groupDetails.description || "No description available for this group."}</p>
  
      {/* Buttons container */}
      <div className="button-container">
        {relationshipStatus === "member" && (
          <button className="btn btn-danger" onClick={handleRemoveMembership}>
            Remove from Group
          </button>
        )}
        {relationshipStatus === "pending" && (
          <button className="btn btn-warning" onClick={handleCancelRequest}>
            Cancel Request
          </button>
        )}
        {relationshipStatus === null && (
          <button className="btn btn-secondary" onClick={handleSendRequest}>
            Send Request
          </button>
        )}
        <button className="btn btn-primary" onClick={handleGoToGroupPosts}>
          Go to Group Posts
        </button>
      </div>
    </div>
  );
  
}

export default OtherGroupDetails;
