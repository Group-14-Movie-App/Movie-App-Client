import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaCopy, FaTwitter, FaTelegram } from "react-icons/fa";
import "./FavoriteGroupDetails.css";

function FavoriteGroupDetails() {
  const { favoriteID } = useParams();
  const location = useLocation();
  const groupName = location.state?.groupName || "Favorite Group";
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [movieDetails, setMovieDetails] = useState([]);

  const pageURL = `${window.location.origin}${location.pathname}`; // Current page URL

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/favorites/movies/${favoriteID}`);
        if (!response.ok) throw new Error("Failed to fetch movies");
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies in favorite group:", error);
      }
    };

    fetchMovies();
  }, [favoriteID]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const details = await Promise.all(
          movies.map(async (movie) => {
            const response = await fetch(
              `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
                movie.movietitle
              )}&year=${movie.releaseyear}&language=en-US`,
              {
                method: "GET",
                headers: {
                  accept: "application/json",
                  Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
                },
              }
            );
            const data = await response.json();
            return (
              data.results?.[0] || {
                id: movie.movietitle,
                movietitle: movie.movietitle,
                releaseyear: movie.releaseyear,
              }
            );
          })
        );
        setMovieDetails(details);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    if (movies.length > 0) {
      fetchMovieDetails();
    }
  }, [movies]);

  const handleMovieClick = (movie) => {
    navigate(`/tmdb-movie-details/${movie.id || encodeURIComponent(movie.movietitle)}`, {
      state: { movie },
    });
  };

  const handleShareClick = async (platform) => {
    try {
      await navigator.clipboard.writeText(pageURL);
      alert("URL copied to clipboard!");

      if (platform === "whatsapp") {
        window.open(`https://wa.me/?text=${encodeURIComponent(pageURL)}`, "_blank");
      } else if (platform === "facebook") {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageURL)}`, "_blank");
      } else if (platform === "twitter") {
        window.open(`https://twitter.com/share?url=${encodeURIComponent(pageURL)}&text=Check this out!`, "_blank");
      } else if (platform === "telegram") {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(pageURL)}&text=Check this out!`, "_blank");
      }
    } catch (error) {
      alert("Failed to copy URL. Try again.");
    }
  };

  return (
    <div className="favorite-group-details">
      <h1>{groupName}</h1>

      <div className="share-buttons-modern">
        <div onClick={() => handleShareClick("whatsapp")} className="share-icon whatsapp">
          <FaWhatsapp />
          <span>WhatsApp</span>
        </div>
        <div onClick={() => handleShareClick("facebook")} className="share-icon facebook">
          <FaFacebook />
          <span>Facebook</span>
        </div>
        <div onClick={() => handleShareClick("twitter")} className="share-icon twitter">
          <FaTwitter />
          <span>Twitter</span>
        </div>
        <div onClick={() => handleShareClick("telegram")} className="share-icon telegram">
          <FaTelegram />
          <span>Telegram</span>
        </div>
        <div onClick={() => handleShareClick("copy")} className="share-icon copy">
          <FaCopy />
          <span>Copy Link</span>
        </div>
      </div>

      {movieDetails.length > 0 ? (
        <div className="movie-grid">
          {movieDetails.map((movie, index) => (
            <div
              key={index}
              className="card"
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path || ""}`}
                alt={movie.movietitle}
                className="card-img-top"
              />
              <div className="card-body">
                <h5>{movie.title || movie.movietitle}</h5>
                <p>Release Year: {movie.releaseyear || movie.release_date?.split("-")[0]}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies found in this group. Add some to get started!</p>
      )}
    </div>
  );
}

export default FavoriteGroupDetails;
