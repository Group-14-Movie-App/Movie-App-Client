import React, { useState, useEffect } from "react";
import "./screensStyles/SearchPage.css"; // Updated CSS for modern styling
import { useNavigate } from "react-router-dom";
//Date Picker Styles
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [releaseStartDate, setReleaseStartDate] = useState("");
  const [releaseEndDate, setReleaseEndDate] = useState("");
  const [sortByPopularity, setSortByPopularity] = useState("");

  const navigate = useNavigate();

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en-US",
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
          },
        }
      );
      const data = await response.json();
      setGenres(data.genres || []);
    };

    fetchGenres();
  }, []);

  // Fetch movies dynamically when filters or search term changes
  useEffect(() => {
    const fetchMovies = async () => {
      let url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=1&include_adult=false`;

      // Add filters to the API URL
      if (searchTerm.trim()) url += `&query=${encodeURIComponent(searchTerm)}`;
      if (selectedGenre) url += `&with_genres=${selectedGenre}`;
      if (releaseStartDate) url += `&primary_release_date.gte=${releaseStartDate}`;
      if (releaseEndDate) url += `&primary_release_date.lte=${releaseEndDate}`;
      if (sortByPopularity) url += `&sort_by=popularity.${sortByPopularity}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
        },
      });
      const data = await response.json();
      setMovies(data.results || []);
    };

    fetchMovies();
  }, [searchTerm, selectedGenre, releaseStartDate, releaseEndDate, sortByPopularity]);

  const handleCardClick = (movie) => {
    navigate(`/tmdb-movie-details/${movie.id}`, { state: { movie } });
  };

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

    {/* Filter Section */}
    <div className="filters-container">
      <div className="filter-item">
        <label>Genre:</label>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-item">
        <label>Release Date From:</label>
        <DatePicker
          selected={releaseStartDate}
          onChange={(date) => setReleaseStartDate(date)}
          placeholderText="Select a start date"
          dateFormat="yyyy-MM-dd"
          className="custom-date-picker"
          calendarClassName="custom-calendar"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
      </div>
      <div className="filter-item">
        <label>Release Date To:</label>
        <DatePicker
          selected={releaseEndDate}
          onChange={(date) => setReleaseEndDate(date)}
          placeholderText="Select an end date"
          dateFormat="yyyy-MM-dd"
          className="custom-date-picker"
          calendarClassName="custom-calendar"
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
      </div>


      <div className="filter-item">
        <label>Sort by Popularity:</label>
        <select
          value={sortByPopularity}
          onChange={(e) => setSortByPopularity(e.target.value)}
        >
          <option value="">Default</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    {/* Movie Grid */}
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
