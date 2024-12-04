import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./screensStyles/UserFavourites.css";

function UserFavourites() {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
  
    // Fetch favorite groups with movie counts from the backend
    fetch(`http://localhost:5000/favorites/with-movie-count/${user.userid}`)
      .then((response) => response.json())
      .then((data) => setFavoriteGroups(data))
      .catch((error) => console.error("Error fetching favorite groups:", error));
  }, []);
  

  const handleGroupClick = (favoriteID, groupName) => {
    // Navigate to FavoriteGroupDetails page
    navigate(`/favorites/${favoriteID}`, { state: { groupName } });
  };

  return (
    <div className="user-favourites">
      <h2>Your Favorite Groups</h2>
      {favoriteGroups.length > 0 ? (
        <div className="favorites-grid">
            {favoriteGroups.map((group) => (
            <div
                key={group.favoriteid}
                className="favorite-card"
                onClick={() => handleGroupClick(group.favoriteid, group.name)}
            >
                <h3>{group.name}</h3>
                <p>{group.movie_count} Movies</p> {/* Display the movie count */}
            </div>
            ))}
        </div>
      
      ) : (
        <p>No favorite groups found. Start adding some!</p>
      )}
    </div>
  );
}

export default UserFavourites;
