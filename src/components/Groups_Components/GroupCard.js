import React from "react";
import "./GroupCard.css";

const GroupCard = ({ group, isMyGroup }) => {
  return (
    <div className="group-card">
      <h3>{group.groupName}</h3>
      <p>{group.description}</p>
      {!isMyGroup && <button>Request to Join</button>}
    </div>
  );
};

export default GroupCard;