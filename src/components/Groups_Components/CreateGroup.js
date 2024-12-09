import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateGroup.css";

function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Tracks if the user is logged in
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setIsLoggedIn(false); // Mark user as not logged in
    }
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      setFeedback("Group name is required.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Retrieve the JWT token
  
    if (!user || !token) {
      setFeedback("Please log in to create a group.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          groupName,
          description,
          ownerID: user.userid,
        }),
      });
  
      if (response.ok) {
        setFeedback("Group created successfully!");
        setGroupName("");
        setDescription("");
        setTimeout(() => {
          window.location.reload(); // Reload the page after successful creation
        }, 500);
      } else {
        const errorData = await response.json();
        setFeedback(errorData.message || "Failed to create group.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      setFeedback("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="create-group">
      {!isLoggedIn ? (
        <div className="login-prompt">
          <p>
            Please{" "}
            <button
              className="login-link"
              onClick={() => navigate("/sign-in-page")}
            >
              log in
            </button>{" "}
            to create a group.
          </p>
        </div>
      ) : (
        <>
          <h2>Create Group</h2>
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control mb-2"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control mb-2"
          />
          <button onClick={handleCreateGroup} className="btn btn-primary">
            Create Group
          </button>
          {feedback && <p className="feedback-message">{feedback}</p>}
        </>
      )}
    </div>
  );
}

export default CreateGroup;
