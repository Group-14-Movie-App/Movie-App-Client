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
    <div className="group-details">
      <h1>{group.groupname}</h1>
      <p>{group.description}</p>

      <h3>Join Requests</h3>
      {joinRequests.length > 0 ? (
        <ul>
          {joinRequests.map((request) => (
            <li key={request.userid}>
              {request.firstname} {request.lastname}
              <button onClick={() => handleAcceptRequest(request.userid)}>Accept</button>
              <button onClick={() => handleDeclineRequest(request.userid)}>Decline</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No join requests at the moment.</p>
      )}

      <h3>Current Members</h3>
      {members.length > 0 ? (
        <ul className="members-list">
          {members.map((member) => (
            <li key={member.userid} className="member-item">
              <div>
                {member.firstname} {member.lastname}
              </div>
              <button
                className="btn btn-danger"
                onClick={() => handleRemoveMember(member.userid)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No members in this group yet.</p>
      )}

      <button onClick={() => navigate(`/group-posts/${groupID}`)}>Go to Group Posts</button>
    </div>
  );
}

export default MyGroupDetails;
