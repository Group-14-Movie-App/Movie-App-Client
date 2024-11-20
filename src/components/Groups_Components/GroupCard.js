import React from "react";
import { Link } from "react-router-dom";
import "./GroupCard.css";

const GroupCard = ({ group, isMyGroup }) => {
  console.log(group); // Log to verify the structure
  return (
    <div className="group-card">
      {/* Display the group name */}
      <h3>{group.groupname}</h3>
     { /* <p>{group.description}</p> */}
      {/* Only show "Request to Join" if it's not the user's group */}
      {!isMyGroup && <button>Request to Join</button>}
      {/* Add View Details button */}
      <Link to={`/group-details/${group.groupid}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default GroupCard;
