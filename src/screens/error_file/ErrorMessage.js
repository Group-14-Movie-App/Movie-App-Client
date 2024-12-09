import React from "react";
import { useNavigate } from "react-router-dom";
import "./ErrorMessage.css"; // Updated stylesheet for enhanced error message.
import PadlockImage from '../../assests/lock-removebg-preview.png' 
function ErrorMessage({ message }) {
  const navigate = useNavigate();

  return (
    <div className="enhanced-error-container">
      <div className="enhanced-error-content">
        <img
          src={PadlockImage} // Replace with your illustration/image path
          alt="Access Denied"
          className="enhanced-error-image"
        />
        <h1 className="enhanced-error-title">Oops! Access Denied</h1>
        <p className="enhanced-error-text">
          {message || "You need to log in to access this page."}
        </p>
        <button
          className="enhanced-error-button"
          onClick={() => navigate("/sign-in-page")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default ErrorMessage;
