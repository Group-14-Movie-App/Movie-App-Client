import React, { useState } from 'react';
import './screensStyles/SearchPage.css'; // Create a CSS file for styling

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState(''); // To hold the user's search term
  const [movies, setMovies] = useState([]); // To hold the fetched movies
  const [error, setError] = useState(null); // To handle any errors

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term.');
      return;
    }

    setError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(searchTerm)}&language=en-US&page=1&include_adult=false`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch movies.');
      }

      const data = await response.json();
      console.log(data)
      setMovies(data.results || []);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to fetch movies. Please try again later.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center">Search Movies</h1>

      <div className="search-bar mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter movie title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-primary mt-3" onClick={handleSearch}>
          Search
        </button>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="card mb-4 shadow-sm">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  className="card-img-top"
                  alt={movie.title}
                />
              ) : (
                <div className="card-img-top no-image">No Image Available</div>
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  {movie.release_date ? `Release Date: ${movie.release_date}` : 'Release Date: Unknown'}
                </p>
                <p className="card-text">{movie.overview || 'No description available.'}</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() =>
                    alert(`Redirect to Movie Details for "${movie.title}"`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found. Try searching for something else.</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
