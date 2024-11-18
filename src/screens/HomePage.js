import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Home_Components/MovieCards.js";
import MovieFetcher from "../components/Home_Components/MovieFetcher.js";
import styles from "./screensStyles/HomePage.module.css";

function HomePage() {
  const [moviesList, setMoviesList] = useState([]);
  // Save search query
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle search button
  function handleSearchClick() {
    navigate(`/search-page?query=${searchQuery}`);
  }

  // Handle Enter key press to submit
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  }

  return (
    <div>
      <div className="input-group input-group-sm mb-3">
        <input
          className="form-control"
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          placeholder="Find Your Favorite"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown} // Add key down eventListener
        />
        <div class="input-group-prepend">
          <button
            class="input-group-text"
            id="inputGroup-sizing-sm"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
      </div>
      {/* Fetch movie data */}
      <div>
        <MovieFetcher setMoviesList={setMoviesList} />
      </div>
      <p className={styles.title}>Top Movies</p>
      <div>
        <MovieCards movieList={moviesList} />
      </div>
    </div>
  );
}

export default HomePage;
