import React from "react";
import { FaWhatsapp, FaFacebook, FaCopy, FaTwitter, FaLinkedin, FaTelegram } from "react-icons/fa";
import "./FavoriteGroupDetails.css";

function ShareOptions({ shareURL }) {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(shareURL).then(
      () => alert("Link copied to clipboard!"),
      () => alert("Failed to copy the link. Try again.")
    );
  };

  return (
    <div className="share-options-container">
      <h3>Share this Group</h3>
      <div className="share-buttons">
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareURL)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button whatsapp"
        >
          <FaWhatsapp /> WhatsApp
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareURL)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button facebook"
        >
          <FaFacebook /> Facebook
        </a>
        <a
          href={`https://twitter.com/share?url=${encodeURIComponent(shareURL)}&text=Check this out!`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button twitter"
        >
          <FaTwitter /> Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button linkedin"
        >
          <FaLinkedin /> LinkedIn
        </a>
        <a
          href={`https://t.me/share/url?url=${encodeURIComponent(shareURL)}&text=Check this out!`}
          target="_blank"
          rel="noopener noreferrer"
          className="share-button telegram"
        >
          <FaTelegram /> Telegram
        </a>
        <button onClick={handleCopyToClipboard} className="share-button copy">
          <FaCopy /> Copy Link
        </button>
      </div>
    </div>
  );
}

export default ShareOptions;
