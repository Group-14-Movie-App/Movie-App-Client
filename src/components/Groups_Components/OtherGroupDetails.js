import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
//import "./OtherGroupDetails.css";

function OtherGroupDetails() {
  const { groupID } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [relationshipStatus, setRelationshipStatus] = useState(null); // "member", "pending", or null
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserID(user.userid);
    }

    const fetchGroupDetails = async () => {
      try {
        const groupResponse = await fetch(`http://localhost:5000/other-groups/${groupID}`);
        if (!groupResponse.ok) throw new Error("Failed to fetch group details.");
        const groupData = await groupResponse.json();
        setGroupDetails(groupData);

        // Fetch user's relationship with the group
        const statusResponse = await fetch(
          `http://localhost:5000/other-groups/${groupID}/status?userID=${user.userid}`
        );
        if (!statusResponse.ok) throw new Error("Failed to fetch relationship status.");
        const statusData = await statusResponse.json();
        setRelationshipStatus(statusData.status); // "member" or "pending"
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) fetchGroupDetails();
  }, [groupID]);

  const handleRemoveMembership = async () => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupID}/remove-member`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });

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
    try {
      const response = await fetch(`http://localhost:5000/other-groups/${groupID}/cancel-request`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
  
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
  

  if (!groupDetails) {
    return <p>Loading group details...</p>;
  }

  return (
    <div className="other-group-details">
      <h1>{groupDetails.groupname}</h1>
      <p>{groupDetails.description || "No description available for this group."}</p>

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
      {!relationshipStatus && <p>You are not associated with this group.</p>}
    </div>
  );
}

export default OtherGroupDetails;
