import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllGroups.css";

function AllGroups() {
  const [groups, setGroups] = useState([]);
  const [userID, setUserID] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch logged-in user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserID(user.userid);
    }

    // Fetch all groups from the backend
    const fetchGroups = async () => {
      try {
        const response = await fetch("http://localhost:5000/all-groups");
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleViewGroup = (groupID) => {
    navigate(`/other-group-details/${groupID}`);
  };

  const handleSendRequest = async (groupID) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to send a join request.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/group-join-requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: user.userid,
                groupID,
            }),
        });

        if (response.ok) {
            alert('Join request sent successfully.');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'Failed to send join request.');
        }
    } catch (error) {
        console.error('Error sending join request:', error);
        alert('An error occurred. Please try again.');
    }
};



  return (
    <div className="all-groups-container">
      {groups.length > 0 ? (
        groups
          .filter((group) => group.ownerid !== userID) // Exclude user's own groups
          .map((group) => (
            <div key={group.groupid} className="group-card">
              <h3>{group.groupname}</h3>
              <p>{group.description}</p>
              <div className="group-card-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => handleViewGroup(group.groupid)}
                >
                  View Group
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSendRequest(group.groupid)}
                >
                  Send Request
                </button>
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
