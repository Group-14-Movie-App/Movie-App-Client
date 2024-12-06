import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddToFavorites from '../components/TMDBMovieDetails_Components/AddToFavorites';
import './screensStyles/TMDBtoFinkkinoMovieDetails.css'

function TMDBtoFinkkinoMovieDetails() {
  const location = useLocation();
  const movie = location.state?.finnkinoMovie;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [feedback, setFeedback] = useState('');

  if (!movie) {
    return <div>Movie details not found in Finnkino.</div>;
  }

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      setFeedback('Please log in to submit a review.');
      return;
    }

    if (!rating || !comment.trim()) {
      setFeedback('Please provide both a rating and a comment.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.userid,
          movieTitle: movie.title,
          releaseDate: movie.productionYear ? `${movie.productionYear}-01-01` : null,
          description: comment,
          rating,
        }),
      });

      if (response.ok) {
        setFeedback('Thank you for your review!');
        setRating(0);
        setComment('');
      } else {
        const errorData = await response.json();
        if (errorData.message.includes('already reviewed')) {
          alert(`You have already reviewed the movie "${movie.title}".`);
        } else {
          setFeedback('Failed to submit review. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setFeedback('An error occurred. Please try again.');
    }
  };

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
  
        {feedback && (
          <p className="review-feedback">
            {feedback}
          </p>
        )}
      </div>
  
      {/* Add to Favorites Section */}
      {movie.title && movie.productionYear ? (
        <AddToFavorites
          movie={{
            original_title: movie.title, // Match the field used in AddToFavorites
            release_date: `${movie.productionYear}-01-01`, // Construct a full release date
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
