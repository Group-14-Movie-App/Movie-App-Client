import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "./error_file/ErrorMessage";
import "./screensStyles/UserFavourites.css";

// Define the base URL for the backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function UserFavourites() {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Fetch the token from localStorage

    if (!user || !token) {
      setIsLoggedIn(false); // Mark as not logged in
      return;
    }

    setIsLoggedIn(true);

    // Fetch favorite groups with movie counts from the backend
    fetch(`${BASE_URL}/favorites/with-movie-count/${user.userid}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
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
      {!isLoggedIn ? (
        <ErrorMessage message="Please log in to view your favorite groups." />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default UserFavourites;
