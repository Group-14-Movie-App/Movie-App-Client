import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Home_Components/MovieCards.js";
import MovieFetcher from "../components/Home_Components/MovieFetcher.js";
import TmdbFetcher from "../components/Home_Components/TmdbFetcher.js";
import styles from "./screensStyles/HomePage.module.css";

function HomePage() {
  const [moviesList, setMoviesList] = useState([]); //Finnkino Movies
  const [limitedMovies, setLimitedMovies] = useState([]); // Limited Finnkino
  const [TmdbMovies, setTmdbMovies] = useState([]);
  const [TmdbLimitedMovies, setTmdbLimitedMovies] = useState([]); //For TMDb
  // Save search query
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Handle TMDb movie click
  function handleTmdbClick(movie) {
    navigate(`/tmdb-movie-details/${movie.tmdbId}`, {
      state: { movie },
    });
  }

  // Handle NowPlaying click
  function handleNowPlayingClick(movie) {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  }

  // Handle Enter key press to submit
  // function handleKeyDown(e) {
  //   if (e.key === "Enter") {
  //     handleSearchClick();
  //   }
  // }

  // Handle "See More"
  function handlePopularSeeMoreClick() {
    navigate("/search-page");
  }

  function handleNowShowingSeeMoreClick() {
    navigate("/showtimes-page");
  }

  return (
    <div>
      {/* TopBar */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar */}
        {/* <form
          className="input-group input-group-sm mb-2 "
          style={{ marginRight: "50px" }}
        >
          <input
            className="form-control"
            aria-label="Search"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            placeholder="Find Your Favorite"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              navigate(`/search-page?query=${encodeURIComponent(searchQuery)}`)
            } // Add key down eventListener
          />
          <div class="input-group-prepend">
            <button
              class="input-group-text"
              id="inputGroup-sizing-sm"
              onClick={() =>
                navigate(
                  `/search-page?query=${encodeURIComponent(searchQuery)}`
                )
              }
            >
              Search
            </button>
          </div>
        </form> */}

        {/* NavBar */}
        <ul class="nav d-flex" style={{ minWidth: "180px" }}>
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
        <MovieCards
          movieList={TmdbLimitedMovies}
          isTmdbMovies={true}
          onCardClick={handleTmdbClick}
        />
        <button onClick={handlePopularSeeMoreClick} className="nav-link">
          See More...
        </button>
      </div>

      {/* Finnkino movies */}
      <div>
        <p className={styles.title}>Now Playing</p>
        <MovieFetcher
          setMoviesList={setMoviesList}
          setLimitedMovies={setLimitedMovies}
        />
      </div>
      <div>
        <MovieCards
          movieList={limitedMovies}
          isTmdbMovies={false}
          onCardClick={handleNowPlayingClick}
        />
        <button onClick={handleNowShowingSeeMoreClick} className="nav-link">
          See More...
        </button>
      </div>
    </div>
  );
}

export default HomePage;
