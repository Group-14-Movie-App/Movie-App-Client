import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AddToFavorites from "../components/TMDBMovieDetails_Components/AddToFavorites";
import "./screensStyles/MovieDetailsPage.css";

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie;

  const [rating, setRating] = useState(0); // To hold the selected rating
  const [comment, setComment] = useState(""); // To hold the user's comment
  const [feedback, setFeedback] = useState(""); // To give feedback after submission
  const [videoId, setVideoId] = useState(""); // To hold the YouTube video ID

  useEffect(() => {
    const fetchYouTubeVideo = async () => {
      try {
        const query = `${movie.title} trailer`;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
            query
          )}&key=${process.env.REACT_APP_YOUTUBE_API_KEY}&type=video&maxResults=1`
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
      fetchYouTubeVideo();
    }
  }, [movie]);

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token"); // Get JWT token
  
    if (!user || !token) {
      setFeedback("Please log in to submit a review.");
      return;
    }
  
    if (!rating || !comment.trim()) {
      setFeedback("Please provide both a rating and a comment.");
      return;
    }
  
    const releaseDate = movie.productionYear
      ? `${movie.productionYear}-01-01`
      : movie.startTime?.split("T")[0] || "0000-01-01"; // Fallback to avoid undefined
  
    const requestBody = {
      userID: user.userid,
      movieTitle: movie.originalTitle || movie.title || "Unknown Title", // Fallback title
      releaseDate,
      description: comment,
      rating,
    };
  
    console.log("Submitting review with body:", requestBody); // Debugging log
  
    try {
      const response = await fetch("https://movieapp-backend1.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include JWT token
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        setFeedback("Thank you for your review!");
        setRating(0);
        setComment("");
      } else {
        const errorData = await response.json();
        console.error("Error response from server:", errorData); // Debugging log
        if (errorData.message.includes("already reviewed")) {
          alert(`You have already reviewed the movie "${movie.originalTitle}".`);
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
    <div className="movie-details-container mt-4">
      <h1 className="movie-details-title">{movie.title}</h1>
      <img
        src={movie.image}
        alt={movie.title}
        className="movie-details-poster img-fluid mb-4"
      />

      <p className="movie-details-item">
        <strong className="movie-details-label">Original Title:</strong>{" "}
        {movie.originalTitle}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">Production Year:</strong>{" "}
        {movie.productionYear}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">Event Type:</strong>{" "}
        {movie.eventType}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label movie-details-highlight">
          Start Time:
        </strong>{" "}
        {movie.startTime}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label movie-details-highlight">
          End Time:
        </strong>{" "}
        {movie.endTime}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">Genres:</strong> {movie.genres}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">Rating:</strong>
        <img
          src={movie.ratingImageUrl}
          alt="Rating"
          className="movie-details-rating-icon"
        />
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">
          Theatre and Auditorium:
        </strong>{" "}
        {movie.theatreAndAuditorium}
      </p>
      <p className="movie-details-item">
        <strong className="movie-details-label">
          Presentation Method and Language:
        </strong>{" "}
        {movie.presentationMethodAndLanguage}
      </p>

      {/* Embed YouTube Video */}
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

      {/* Add Review Section */}
      <div className="movie-details-review-section mt-5">
        <h3 className="movie-details-review-title">Rate this Movie</h3>
        <div className="movie-details-rating-stars mb-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className={`movie-details-rating-star ${
                value <= rating ? "selected" : ""
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="movie-details-review-comment form-control mb-3"
          rows="4"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className="btn btn-primary movie-details-submit-review-btn"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>

        {feedback && (
          <p className="movie-details-review-feedback mt-3">{feedback}</p>
        )}
      </div>

      {/* Add to Favorites */}
      <AddToFavorites movie={movie} />
    </div>
  );
}

export default MovieDetailsPage;
