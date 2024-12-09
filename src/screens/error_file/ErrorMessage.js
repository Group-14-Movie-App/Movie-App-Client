import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorMessage.css'; // Add custom styles for the error message if needed.

function ErrorMessage({ message }) {
  const navigate = useNavigate();

  return (
    <div className="error-message-container">
      <h1 className="error-title">Access Denied</h1>
      <p className="error-text">{message || 'You need to log in to access this page.'}</p>
      <button className="error-button" onClick={() => navigate('/sign-in-page')}>
        Go to Login
      </button>
    </div>
  );
}

export default ErrorMessage;
