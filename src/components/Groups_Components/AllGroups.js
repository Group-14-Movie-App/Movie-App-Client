import React, { useState, useEffect } from "react";
import GroupCard from "./GroupCard"; // Assuming you have a reusable GroupCard component

function AllGroups() {
    const [allGroups, setAllGroups] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all groups when the component mounts
    useEffect(() => {
        const fetchAllGroups = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/all-groups");
                if (response.ok) {
                    const data = await response.json();
                    setAllGroups(data.groups); // Assuming the backend returns a "groups" array
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to fetch groups.");
                }
            } catch (err) {
                console.error("Error fetching all groups:", err);
                setError("An error occurred while fetching the groups.");
            }
        };

        fetchAllGroups();
    }, []); // Empty dependency array to run only once when component mounts

    return (
        <div>
          <h2>All Groups</h2>
          <div className="group-cards-container">
            {allGroups.length > 0 ? (
              allGroups.map((group) => (
                <GroupCard key={group.groupID} group={group} isMyGroup={false} />
              ))
            ) : (
              <p>No groups available to join.</p>
            )}
          </div>
        </div>
      );
    };
    
    export default AllGroups;


