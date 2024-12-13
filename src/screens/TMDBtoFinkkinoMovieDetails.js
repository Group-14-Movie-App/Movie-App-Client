import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AddToFavorites from "../components/TMDBMovieDetails_Components/AddToFavorites";
import "./screensStyles/TMDBtoFinkkinoMovieDetails.css";

// Define the base URL for the backend
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

function TMDBtoFinkkinoMovieDetails() {
  const location = useLocation();
  const movie = location.state?.finnkinoMovie;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [videoId, setVideoId] = useState(""); // Hold YouTube video ID

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
          movieTitle: movie.title,
          releaseDate: movie.productionYear
            ? `${movie.productionYear}-01-01`
            : null,
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
          alert(`You have already reviewed the movie "${movie.title}".`);
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
    return <div>Movie details not found in Finnkino.</div>;
  }

  return (
    <div className="finnkino-movie-details-container">
      <h1 className="finnkino-movie-title">{movie.title}</h1>
      <img
        src={movie.image}
        alt={movie.title}
        className="finnkino-movie-poster"
      />

      <p className="finnkino-movie-detail">
        <strong>Original Title:</strong> {movie.originalTitle}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Production Year:</strong> {movie.productionYear}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Event Type:</strong> {movie.eventType}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Start Time:</strong> {movie.startTime}
      </p>
      <p className="finnkino-movie-detail">
        <strong>End Time:</strong> {movie.endTime}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Genres:</strong> {movie.genres}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Rating:</strong>{" "}
        <img
          src={movie.ratingImageUrl}
          alt="Rating"
          className="finnkino-rating-icon"
        />
      </p>
      <p className="finnkino-movie-detail">
        <strong>Theatre and Auditorium:</strong> {movie.theatreAndAuditorium}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Presentation Method and Language:</strong>{" "}
        {movie.presentationMethodAndLanguage}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Spoken Language:</strong> {movie.spokenLanguage}
      </p>
      <p className="finnkino-movie-detail">
        <strong>Subtitles:</strong> {movie.subtitleLanguage1},{" "}
        {movie.subtitleLanguage2}
      </p>

      {movie.contentDescriptors?.length > 0 && (
        <div className="finnkino-content-descriptors">
          <strong>Content Descriptors:</strong>
          <ul className="finnkino-content-list">
            {movie.contentDescriptors.map((descriptor, index) => (
              <li key={index} className="finnkino-content-item">
                <img
                  src={descriptor.imageURL}
                  alt={descriptor.name}
                  className="finnkino-content-icon"
                />
                {descriptor.name}
              </li>
            ))}
          </ul>
        </div>
      )}

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
      <div className="review-section mt-5">
        <h3 className="review-title">Rate this Movie</h3>
        <div className="rating-stars">
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
          className="review-comment"
          rows="4"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="submit-review-btn" onClick={handleSubmitReview}>
          Submit Review
        </button>

        {feedback && <p className="review-feedback">{feedback}</p>}
      </div>

      {/* Add to Favorites Section */}
      {movie.title && movie.productionYear ? (
        <AddToFavorites
          movie={{
            original_title: movie.title,
            release_date: `${movie.productionYear}-01-01`,
          }}
        />
      ) : (
        <p className="add-favorites-warning">
          Movie details are incomplete for adding to favorites.
        </p>
      )}
    </div>
  );
}

export default TMDBtoFinkkinoMovieDetails;
