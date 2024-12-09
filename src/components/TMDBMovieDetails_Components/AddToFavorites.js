import React, { useEffect, useState } from 'react';
import './AddToFavorites.css'

function AddToFavorites({ movie }) {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch favorite groups for the logged-in user
    const fetchFavoriteGroups = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token'); // Retrieve JWT token
    
      if (!user || !token) {
        setFeedback('Please log in to manage favorite groups.');
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:5000/favorites?userID=${user.userid}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include Authorization header
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch favorite groups.');
        }
        const data = await response.json();
        setFavoriteGroups(data);
      } catch (error) {
        console.error('Error fetching favorite groups:', error);
        setFeedback('Failed to load favorite groups.');
      }
    };
    
  
    fetchFavoriteGroups();
  }, []);
  
  const handleAddToFavorites = async () => {
    const token = localStorage.getItem("token"); // Retrieve JWT token
  
    if (!token) {
      alert("Please log in to add movies to your favorites.");
      return;
    }
  
    if (!selectedGroup) {
      alert("Please select a favorite group.");
      return;
    }
  
    const payload = {
      favoriteID: selectedGroup,
      movieTitle: movie.original_title || movie.title || "Unknown Title", // Fallback to avoid null
      releaseDate: movie.release_date || "1970-01-01", // Fallback to avoid invalid date
    };
  
    console.log("Payload to be sent:", payload); // Debugging log
  
    try {
      const response = await fetch("http://localhost:5000/favorite-movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include Authorization header
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        alert("Movie added to favorite group successfully!");
        setFeedback("");
      } else {
        const errorData = await response.json();
        console.error("Server response:", errorData); // Debugging log
        alert(errorData.message || "Failed to add movie to favorite group.");
      }
    } catch (error) {
      console.error("Error adding movie to favorite group:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  
  

  return (
    <div className="add-to-favorites-container">
      <h4 className="add-to-favorites-title">Add to Favorites</h4>
      {favoriteGroups.length > 0 ? (
        <div className="favorites-selection">
          <select
            className="favorites-dropdown"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select a Favorite Group</option>
            {favoriteGroups.map((group) => (
              <option key={group.favoriteid} value={group.favoriteid}>
                {group.name}
              </option>
            ))}
          </select>
          <button className="favorites-add-button" onClick={handleAddToFavorites}>
            Add to Favorites
          </button>
        </div>
      ) : (
        <p className="favorites-feedback">
          {feedback || 'No favorite groups available.'}
        </p>
      )}
    </div>
  );
}

export default AddToFavorites;
