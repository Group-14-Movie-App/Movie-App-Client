import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCards from "../components/Home_Components/MovieCards.js";
import MovieFetcher from "../components/Home_Components/MovieFetcher.js";
import TmdbFetcher from "../components/Home_Components/TmdbFetcher.js";
import UpcomingFetcher from "../components/Home_Components/UpcomingFetcher.js";
import "./screensStyles/HomePage.css";

function HomePage() {
  const [moviesList, setMoviesList] = useState([]); // Finnkino Movies
  const [TmdbMovies, setTmdbMovies] = useState([]); // TMDb Movies
  const [upcomingMovies, setUpcomingMovies] = useState([]); // Upcoming Movies

  const [currentPopularPage, setCurrentPopularPage] = useState(0);
  const [currentNowPlayingPage, setCurrentNowPlayingPage] = useState(0);
  const [currentUpcomingPage, setCurrentUpcomingPage] = useState(0);
  const [activeSection, setActiveSection] = useState("popular"); // Track active section

  const moviesPerPage = 6; // Number of movies to display per page
  const navigate = useNavigate();

  // Section refs
  const popularRef = useRef(null);
  const nowPlayingRef = useRef(null);
  const upcomingRef = useRef(null);

  // Scroll tracking to determine the active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "popular", ref: popularRef },
        { id: "nowPlaying", ref: nowPlayingRef },
        { id: "upcoming", ref: upcomingRef },
      ];

      const viewportMiddle = window.innerHeight / 2;

      sections.forEach((section) => {
        const rect = section.ref.current.getBoundingClientRect();
        if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTmdbClick = (movie) => {
    navigate(`/tmdb-movie-details/${movie.id}`, { state: { movie } });
  };

  const handleNowPlayingClick = (movie) => {
    navigate(`/movie/${movie.id}`, { state: { movie } });
  };

  const handleUpcomingClick = (movie) => {
    navigate(`/tmdb-movie-details/${movie.id}`, { state: { movie } });
  };

  // Slider Controls for Popular Movies
  const handlePopularNextPage = () => {
    if ((currentPopularPage + 1) * moviesPerPage < TmdbMovies.length) {
      setCurrentPopularPage(currentPopularPage + 1);
    }
  };

  const handlePopularPrevPage = () => {
    if (currentPopularPage > 0) {
      setCurrentPopularPage(currentPopularPage - 1);
    }
  };

  // Slider Controls for Now Playing Movies
  const handleNowPlayingNextPage = () => {
    if ((currentNowPlayingPage + 1) * moviesPerPage < moviesList.length) {
      setCurrentNowPlayingPage(currentNowPlayingPage + 1);
    }
  };

  const handleNowPlayingPrevPage = () => {
    if (currentNowPlayingPage > 0) {
      setCurrentNowPlayingPage(currentNowPlayingPage - 1);
    }
  };

  // Slider Controls for Upcoming Movies
  const handleUpcomingNextPage = () => {
    if ((currentUpcomingPage + 1) * moviesPerPage < upcomingMovies.length) {
      setCurrentUpcomingPage(currentUpcomingPage + 1);
    }
  };

  const handleUpcomingPrevPage = () => {
    if (currentUpcomingPage > 0) {
      setCurrentUpcomingPage(currentUpcomingPage - 1);
    }
  };

  // Get the current page of movies for each section
  const currentPopularMovies = TmdbMovies.slice(
    currentPopularPage * moviesPerPage,
    (currentPopularPage + 1) * moviesPerPage
  );

  const currentNowPlayingMovies = moviesList.slice(
    currentNowPlayingPage * moviesPerPage,
    (currentNowPlayingPage + 1) * moviesPerPage
  );

  const currentUpcomingMovies = upcomingMovies.slice(
    currentUpcomingPage * moviesPerPage,
    (currentUpcomingPage + 1) * moviesPerPage
  );

  return (
    <div>
      {/* Popular Movies Section */}
      <div ref={popularRef} id="popular" className="section">
        <p className={`title ${activeSection === "popular" ? "active-title" : ""}`}>Popular</p>
        <TmdbFetcher setTmdbMovies={setTmdbMovies} />
        <div className="slider-container d-flex align-items-center justify-content-center">
          <button
            className="slider-button slider-button-left"
            onClick={handlePopularPrevPage}
            disabled={currentPopularPage === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M16 21L6 12L16 3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div className="movie-cards-wrapper">
            <MovieCards
              movieList={currentPopularMovies}
              isTmdbMovies={true}
              onCardClick={handleTmdbClick}
            />
          </div>
          <button
            className="slider-button slider-button-right"
            onClick={handlePopularNextPage}
            disabled={
              (currentPopularPage + 1) * moviesPerPage >= TmdbMovies.length
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M8 3L18 12L8 21"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Now Playing Section */}
      <div ref={nowPlayingRef} id="nowPlaying" className="section">
        <p className={`title ${activeSection === "nowPlaying" ? "active-title" : ""}`}>Now Playing</p>
        <MovieFetcher setMoviesList={setMoviesList} />
        <div className="slider-container d-flex align-items-center justify-content-center">
          <button
            className="slider-button slider-button-left"
            onClick={handleNowPlayingPrevPage}
            disabled={currentNowPlayingPage === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M16 21L6 12L16 3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div className="movie-cards-wrapper">
            <MovieCards
              movieList={currentNowPlayingMovies}
              isTmdbMovies={false}
              onCardClick={handleNowPlayingClick}
            />
          </div>
          <button
            className="slider-button slider-button-right"
            onClick={handleNowPlayingNextPage}
            disabled={
              (currentNowPlayingPage + 1) * moviesPerPage >= moviesList.length
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M8 3L18 12L8 21"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Upcoming Movies Section */}
      <div ref={upcomingRef} id="upcoming" className="section">
        <p className={`title ${activeSection === "upcoming" ? "active-title" : ""}`}>Upcoming</p>
        <UpcomingFetcher setUpcomingMovies={setUpcomingMovies} />
        <div className="slider-container d-flex align-items-center justify-content-center">
          <button
            className="slider-button slider-button-left"
            onClick={handleUpcomingPrevPage}
            disabled={currentUpcomingPage === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M16 21L6 12L16 3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <div className="movie-cards-wrapper">
            <MovieCards
              movieList={currentUpcomingMovies}
              isTmdbMovies={true}
              onCardClick={handleUpcomingClick}
            />
          </div>
          <button
            className="slider-button slider-button-right"
            onClick={handleUpcomingNextPage}
            disabled={
              (currentUpcomingPage + 1) * moviesPerPage >= upcomingMovies.length
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M8 3L18 12L8 21"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
