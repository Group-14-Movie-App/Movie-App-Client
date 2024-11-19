import React, { useState, useEffect } from "react";
import axios from "axios";

const GroupDetails = ({ groupId }) => {
  const [groupDetails, setGroupDetails] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  // Fetch group details and members on mount
  useEffect(() => {
    fetchGroupDetails();
  }, []);

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`/api/groups/${groupId}`);
      setGroupDetails(response.data.group);
      setPendingRequests(response.data.pendingRequests);
      setGroupMembers(response.data.members);
    } catch (error) {
      console.error("Error fetching group details:", error);
    }
  };

  // Handle Accept Request
  const handleAccept = async (userId) => {
    try {
      await axios.patch(`/api/groups/${groupId}/members/${userId}`, {
        action: "accept",
      });
      fetchGroupDetails(); // Refresh the data
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // Handle Decline Request
  const handleDecline = async (userId) => {
    try {
      await axios.patch(`/api/groups/${groupId}/members/${userId}`, {
        action: "decline",
      });
      fetchGroupDetails(); // Refresh the data
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // Handle Remove Member
  const handleRemoveMember = async (userId) => {
    try {
      await axios.delete(`/api/groups/${groupId}/members/${userId}`);
      fetchGroupDetails(); // Refresh the data
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="group-details">
      <h1>{groupDetails?.name}</h1>
      <p>Description: {groupDetails?.description || "No description provided."}</p>

      <h3>Pending Requests</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.map((request) => (
            <tr key={request.userId}>
              <td>{request.name}</td>
              <td>
                <button onClick={() => handleAccept(request.userId)}>Accept</button>
                <button onClick={() => handleDecline(request.userId)}>Decline</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Group Members</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {groupMembers.map((member) => (
            <tr key={member.userId}>
              <td>{member.name}</td>
              <td>
                <button onClick={() => handleRemoveMember(member.userId)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupDetails;
