import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Home_Components/MovieCards.js";
import MovieFetcher from "../components/Home_Components/MovieFetcher.js";
import TmdbFetcher from "../components/Home_Components/TmdbFetcher.js";
import styles from "./screensStyles/HomePage.module.css";

function HomePage() {
  const [moviesList, setMoviesList] = useState([]);
  const [limitedMovies, setLimitedMovies] = useState([]); //For Finnkino
  const [TmdbMovies, setTmdbMovies] = useState([]);
  const [TmdbLimitedMovies, setTmdbLimitedMovies] = useState([]); //For TMDb
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

  // Handle "See More"
  function handleNowShowingSeeMoreClick() {
    navigate("/showtimes-page");
  }

  function handlePopularSeeMoreClick() {
    navigate("/search-page");
  }

  // function handleTmdbCardClick(movieId) {
  //   navigate(`/movie/${movieId}`, { state: { movieId, source: "tmdb" } });
  // }

  return (
    <div>
      {/* Search Bar */}
      {/* <div className="input-group input-group-sm mb-3">
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
      </div> */}
      {/* TopBar */}
      <div>
        <ul class="nav justify-content-end">
          <li class="nav-item">
            <a class="nav-link active" href="/sign-in-page">
              Sign in
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="/register-page">
              Register
            </a>
          </li>
        </ul>
      </div>
      {/* TMDb movies */}
      <div>
        <p className={styles.title}>Popular</p>
        <TmdbFetcher
          setTmdbMovies={setTmdbMovies}
          setLimitedMovies={setTmdbLimitedMovies}
        />
        <MovieCards movieList={TmdbLimitedMovies} isTmdbMovies={true} />
        <button onClick={handlePopularSeeMoreClick} className="nav-link">
          See More...
        </button>
      </div>

      {/* Finnkino movies */}
      <div>
        <MovieFetcher
          setMoviesList={setMoviesList}
          setLimitedMovies={setLimitedMovies}
        />
      </div>
      <p className={styles.title}>Now Playing</p>
      <div>
        <MovieCards movieList={limitedMovies} isTmdbMovies={false} />
        <button onClick={handleNowShowingSeeMoreClick} className="nav-link">
          See More...
        </button>
      </div>
    </div>
  );
}

export default HomePage;
