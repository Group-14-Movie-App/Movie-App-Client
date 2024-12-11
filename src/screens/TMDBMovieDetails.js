import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddToFavorites from "../components/TMDBMovieDetails_Components/AddToFavorites";
import "./screensStyles/TMDBMovieDetails.css";

// Define the base URL for the backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function TMDBMovieDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFinnkinoAvailable, setIsFinnkinoAvailable] = useState(false);
  const [finnkinoMovie, setFinnkinoMovie] = useState(null);
  const [videoId, setVideoId] = useState(""); // Hold YouTube video ID

  const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Fetch API key from .env

  useEffect(() => {
    const checkFinnkinoAPI = async () => {
      try {
        const response = await fetch("https://www.finnkino.fi/xml/Schedule/");
        const textData = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, "application/xml");
        const shows = Array.from(xml.getElementsByTagName("Show")).map(
          (show) => ({
            title: show.getElementsByTagName("Title")[0]?.textContent,
            originalTitle:
              show.getElementsByTagName("OriginalTitle")[0]?.textContent,
            productionYear:
              show.getElementsByTagName("ProductionYear")[0]?.textContent,
            startTime:
              show.getElementsByTagName("dttmShowStart")[0]?.textContent,
            endTime: show.getElementsByTagName("dttmShowEnd")[0]?.textContent,
            genres: show.getElementsByTagName("Genres")[0]?.textContent,
            theatreAndAuditorium: show.getElementsByTagName(
              "TheatreAndAuditorium"
            )[0]?.textContent,
            image: show.getElementsByTagName("EventMediumImagePortrait")[0]
              ?.textContent,
            ratingImageUrl:
              show.getElementsByTagName("RatingImageUrl")[0]?.textContent,
          })
        );

        const match = shows.find(
          (show) =>
            (show.title.toLowerCase() === movie.title.toLowerCase() ||
              show.originalTitle.toLowerCase() ===
                movie.original_title.toLowerCase()) &&
            show.productionYear === movie.release_date.split("-")[0]
        );

        if (match) {
          setIsFinnkinoAvailable(true);
          setFinnkinoMovie(match);
        }
      } catch (error) {
        console.error("Error fetching Finnkino API:", error);
      }
    };

    const fetchYouTubeVideo = async () => {
      try {
        const query = `${movie.title} trailer`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
          )}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setVideoId(data.items[0].id.videoId);
        }
      } catch (error) {
        console.error("Error fetching YouTube video:", error);
      }
    };

    if (movie) {
      checkFinnkinoAPI();
      fetchYouTubeVideo();
    }
  }, [movie, YOUTUBE_API_KEY]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Get the JWT token
  
    if (!user) {
      setFeedback("Please log in to submit a review.");
      return;
    }
  
    if (!rating || !comment.trim()) {
      setFeedback("Please provide both a rating and a comment.");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token
        },
        body: JSON.stringify({
          userID: user.userid,
          movieTitle: movie.original_title,
          releaseDate: movie.release_date,
          description: comment,
          rating,
        }),
      });
  
      if (response.ok) {
        setFeedback("Thank you for your review!");
        setRating(0);
        setComment("");
      } else {
        const errorData = await response.json();
        if (errorData.message.includes("already reviewed")) {
          alert(
            `You have already reviewed the movie "${movie.original_title}".`
          );
        } else {
          setFeedback("Failed to submit review. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setFeedback("An error occurred. Please try again.");
    }
  };
  

  if (!movie) {
    return <div>Movie details not found.</div>;
  }

  return (
    <div className="tmdb-movie-details-container mt-4">
      <h1 className="movie-title">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="movie-poster img-fluid mb-4"
      />
      <p className="movie-detail">
        <strong>Original Title:</strong> {movie.original_title}
      </p>
      <p className="movie-detail">
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p className="movie-detail">
        <strong>Overview:</strong> {movie.overview}
      </p>
      <p className="movie-detail">
        <strong>Genres:</strong>{" "}
        {movie.genre_ids && Array.isArray(movie.genre_ids)
          ? movie.genre_ids.join(", ")
          : ""}
      </p>
      <p className="movie-detail">
        <strong>Rating:</strong> {movie.vote_average} / 10
      </p>
      <p className="movie-detail">
        <strong>Vote Count:</strong> {movie.vote_count}
      </p>

      {videoId && (
        <div className="youtube-video mt-4">
          <h3>Watch Trailer</h3>
          <iframe
            width="560"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      {isFinnkinoAvailable && (
        <button
          className="btn btn-primary finnkino-details-btn mt-4"
          onClick={() =>
            navigate("/tmdb-to-finnkino-details", { state: { finnkinoMovie } })
          }
        >
          View Theater Details
        </button>
      )}

      <div className="review-section mt-5">
        <h3 className="review-title">Rate this Movie</h3>
        <div className="rating-stars mb-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className={`rating-star ${value <= rating ? "selected" : ""}`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="review-comment form-control mb-3"
          rows="4"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="btn btn-primary submit-review-btn"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>

        {feedback && <p className="review-feedback mt-3 text-success">{feedback}</p>}
      </div>

      <AddToFavorites movie={movie} />
    </div>
  );
}

export default TMDBMovieDetails;
