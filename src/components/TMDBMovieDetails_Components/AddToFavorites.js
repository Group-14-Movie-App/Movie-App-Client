import React, { useEffect, useState } from 'react';

function AddToFavorites({ movie }) {
  const [favoriteGroups, setFavoriteGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch favorite groups for the logged-in user
    const fetchFavoriteGroups = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        setFeedback('Please log in to manage favorite groups.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/favorites/${user.userid}`);
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
    if (!selectedGroup) {
      alert('Please select a favorite group.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/favorite-movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favoriteID: selectedGroup,
          movieTitle: movie.original_title, // Use the original title
          releaseDate: movie.release_date, // Send full release date
        }),
      });

      if (response.ok) {
        alert('Movie added to favorite group successfully!');
        setFeedback('');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add movie to favorite group.');
      }
    } catch (error) {
      console.error('Error adding movie to favorite group:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="add-to-favorites">
      <h4>Add to Favorites</h4>
      {favoriteGroups.length > 0 ? (
        <div>
          <select
            className="form-select mb-3"
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
          <button className="btn btn-primary" onClick={handleAddToFavorites}>
            Add to Favorites
          </button>
        </div>
      ) : (
        <p>{feedback || 'No favorite groups available.'}</p>
      )}
    </div>
  );
}

export default AddToFavorites;
