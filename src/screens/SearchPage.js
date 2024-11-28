import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TmdbFetcher from "../components/Home_Components/TmdbFetcher";
import MovieFetcher from "../components/Home_Components/MovieFetcher";
import MovieCards from "../components/Home_Components/MovieCards";

function SearchPage() {
  const [TmdbMovies, setTmdbMovies] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("top_rated");
  const navigate = useNavigate();

  const categories = [
    { key: "top_rated", name: "Top Rated" },
    { key: "popular", name: "Popular" },
    { key: "upcoming", name: "Upcoming" },
    { key: "now_playing", name: "Now Playing" }, // data from Finnkino
    { key: "action", name: "Action" },
    { key: "comedy", name: "Comedy" },
    { key: "horror", name: "Horror" },
    { key: "romance", name: "Romance" },
    { key: "crime", name: "Crime" },
  ];

  function handleMovieClick(movie) {
    if (currentCategory === "now_playing") {
      navigate(`/movie/${encodeURIComponent(movie.title)}`);
    } else {
      navigate(`/movie-reviews/${encodeURIComponent(movie.title)}`);
    }
  }

  return (
    <div>
      {/* Search Bar */}
      <form
        className="input-group input-group-sm mb-2 "
        style={{ marginRight: "50px" }}
      >
        <input
          className="form-control"
          aria-label="Search"
          aria-describedby="inputGroup-sizing-sm"
          type="text"
          placeholder="Find Your Favorite"
          //   value={searchQuery}
          //   onChange={(e) => setSearchQuery(e.target.value)}
          //   onKeyDown={handleKeyDown} // Add key down eventListener
        />
        <div className="input-group-prepend">
          <button
            className="input-group-text"
            id="inputGroup-sizing-sm"
            // onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
      </form>

      {/* Category Buttons */}
      <div className="mb-4">
        {categories.map((category) => (
          <button
            key={category.key}
            className={`btn btn-sm ${
              currentCategory === category.key ? "btn" : "btn-secondary"
            }`}
            style={{ margin: "8px 14px 8px 0" }}
            onClick={() => setCurrentCategory(category.key)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/*  Fetching and displaying specific category movies */}
      <div>
        {currentCategory === "now_playing" ? (
          <MovieFetcher
            setMoviesList={setNowPlaying}
            category={currentCategory}
          />
        ) : (
          <TmdbFetcher
            setTmdbMovies={setTmdbMovies}
            category={currentCategory}
            setLimitedMovies={() => {}}
          />
        )}
        <MovieCards
          movieList={
            currentCategory === "now_playing" ? nowPlaying : TmdbMovies
          }
          onMovieClick={handleMovieClick}
        />
      </div>
    </div>
  );
}

export default SearchPage;
