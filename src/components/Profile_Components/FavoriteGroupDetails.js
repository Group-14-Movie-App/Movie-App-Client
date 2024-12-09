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
  const [movieDetails, setMovieDetails] = useState({});

  const pageURL = `${window.location.origin}${location.pathname}`; // Current page URL

  const fetchMovies = async () => {
    const token = localStorage.getItem("token"); // Fetch the token
    try {
      const response = await fetch(`http://localhost:5000/favorites/movies/${favoriteID}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Error fetching movies in favorite group:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [favoriteID]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const details = {};

      const uniqueMovies = Array.from(new Set(movies.map((movie) => movie.movietitle)));

      for (const movieTitle of uniqueMovies) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              movieTitle
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

          details[movieTitle] = data.results[0] || null;
        } catch (error) {
          console.error("Error fetching movie details:", error);
        }
      }
      setMovieDetails(details);
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

  const handleRemoveMovie = async (movieTitle, releaseYear) => {
    const token = localStorage.getItem("token");
    if (!movieTitle || !releaseYear) {
      alert("Invalid movie data. Please try again.");
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:5000/favorite-movies/${favoriteID}?movieTitle=${encodeURIComponent(
          movieTitle
        )}&releaseYear=${releaseYear}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.ok) {
        await fetchMovies();
        alert("Movie removed successfully!");
      } else {
        console.error("Failed to remove movie.");
        alert("Failed to remove movie. Please try again.");
      }
    } catch (error) {
      console.error("Error removing movie:", error);
      alert("An error occurred. Please try again.");
    }
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

      {Object.keys(movieDetails).length > 0 ? (
        <div className="movie-grid">
          {Object.entries(movieDetails).map(([movieTitle, movie]) => (
            <div key={movieTitle} className="card" style={{ cursor: "pointer" }}>
              {movie?.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movieTitle}
                  className="card-img-top"
                  onClick={() => handleMovieClick(movie)}
                />
              ) : (
                <div className="card-img-placeholder" onClick={() => handleMovieClick(movie)}>
                  No Image Available
                </div>
              )}
              <div className="card-body">
                <h5>{movie?.title || movieTitle}</h5>
                <p>Release Year: {movie?.release_date?.split("-")[0] || "Unknown"}</p>
                <button
                  className="btn btn-danger"
                  onClick={() => handleRemoveMovie(movieTitle, movie?.release_date?.split("-")[0])}
                >
                  Remove
                </button>
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
