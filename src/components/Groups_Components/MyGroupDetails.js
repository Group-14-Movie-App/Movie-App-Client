import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./MyGroupDetails.css";

function MyGroupDetails() {
  const { groupID } = useParams();
  const location = useLocation();
  const group = location.state?.group || {};
  const [joinRequests, setJoinRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!groupID) {
      console.error("Group ID is undefined.");
      return;
    }

    const fetchGroupData = async () => {
      try {
        const [requestsResponse, membersResponse] = await Promise.all([
          fetch(`http://localhost:5000/groups/${groupID}/join-requests`),
          fetch(`http://localhost:5000/groups/${groupID}/members`),
        ]);
    
        console.log("Join Requests Response:", await requestsResponse.clone().json());
        console.log("Members Response:", await membersResponse.clone().json());
    
        if (!requestsResponse.ok || !membersResponse.ok) {
          throw new Error("Failed to fetch group data.");
        }
    
        const requestsData = await requestsResponse.json();
        const membersData = await membersResponse.json();
    
        setJoinRequests(requestsData);
        setMembers(membersData);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    
    

    fetchGroupData();
  }, [groupID]);

  const handleAcceptRequest = async (userID) => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupID}/accept-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
  
      if (response.ok) {
        const acceptedUser = joinRequests.find((req) => req.userid === userID);
        setJoinRequests(joinRequests.filter((req) => req.userid !== userID)); // Remove from pending requests
        setMembers([...members, acceptedUser]); // Add to members
        alert("Request accepted!");
      } else {
        alert("Failed to accept request. Please try again.");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };
  
  

  const handleDeclineRequest = async (userID) => {
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupID}/decline-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });

      if (response.ok) {
        setJoinRequests(joinRequests.filter((req) => req.userid !== userID));
        alert("Request declined.");
      } else {
        alert("Failed to decline request. Please try again.");
      }
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  const handleRemoveMember = async (userID) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/groups/${groupID}/remove-member`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID }),
      });
  
      if (response.ok) {
        setMembers(members.filter((member) => member.userid !== userID));
        alert("Member removed successfully.");
      } else {
        alert("Failed to remove member. Please try again.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };
  

  return (
    <div className="group-details-container">
      <h1 className="group-details-title">{group.groupname}</h1>
      <p className="group-details-description">{group.description}</p>
  
      <h3 className="section-title">Join Requests</h3>
      {joinRequests.length > 0 ? (
        <ul className="join-requests-list">
          {joinRequests.map((request) => (
            <li key={request.userid} className="join-request-item">
              <span className="requester-name">
                {request.firstname} {request.lastname}
              </span>
              <div className="request-actions">
                <button
                  className="btn-accept-request"
                  onClick={() => handleAcceptRequest(request.userid)}
                >
                  Accept
                </button>
                <button
                  className="btn-decline-request"
                  onClick={() => handleDeclineRequest(request.userid)}
                >
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-requests-message">No join requests at the moment.</p>
      )}
  
      <h3 className="section-title">Current Members</h3>
      {members.length > 0 ? (
        <ul className="members-list">
          {members.map((member) => (
            <li key={member.userid} className="member-item">
              <div className="member-name">
                {member.firstname} {member.lastname}
              </div>
              <button
                className="btn-remove-member"
                onClick={() => handleRemoveMember(member.userid)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-members-message">No members in this group yet.</p>
      )}
  
      <button
        onClick={() => navigate(`/my-group-posts/${groupID}`, { state: { group } })}
        className="btn-go-posts"
      >
        Go to Group Posts
      </button>
    </div>
  );
  
}

export default MyGroupDetails;
