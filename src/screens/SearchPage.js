import React, { useState } from "react";
import "./screensStyles/SearchPage.css"; // Updated CSS for modern styling
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        searchTerm
      )}&language=en-US&page=1&include_adult=false`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
        },
      }
    );
    const data = await response.json();
    setMovies(data.results || []);
  };

  const handleCardClick = (movie) => {
    navigate(`/tmdb-movie-details/${movie.id}`, { state: { movie } });
  };

  return (
    <div className="search-container">
      <h1 className="search-title">Search Movies</h1>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for movies..."
        />
        <button className="search-button" onClick={handleSearch}>
          🔍 Search
        </button>
      </div>
      <div className="search-movie-grid">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="search-movie-card"
            onClick={() => handleCardClick(movie)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="search-movie-image"
            />
            <div className="search-movie-details">
              <h5 className="search-movie-title">{movie.title}</h5>
              <p className="search-movie-date">{movie.release_date}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default SearchPage;
