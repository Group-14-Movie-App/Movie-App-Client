import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddToFavorites from '../components/TMDBMovieDetails_Components/AddToFavorites';
import './screensStyles/MovieDetailsPage.css'

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie;

  const [rating, setRating] = useState(0); // To hold the selected rating
  const [comment, setComment] = useState(''); // To hold the user's comment
  const [feedback, setFeedback] = useState(''); // To give feedback after submission

  if (!movie) {
    return <div>Movie details not found.</div>;
  }

  // Ensure `movie` contains `original_title` and `release_date`
  const movieDetails = {
    original_title: movie.originalTitle || movie.title, // Use `title` if `originalTitle` is missing
    release_date: movie.productionYear ? `${movie.productionYear}-01-01` : movie.startTime.split('T')[0],
    ...movie, // Spread the rest of the movie object
  };

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
  
    const releaseDate = movieDetails.release_date;

    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: user.userid,
          movieTitle: movieDetails.original_title,
          releaseDate,
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
          alert(`You have already reviewed the movie "${movieDetails.original_title}".`);
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
    <div className="movie-details-container mt-4">
      <h1 className="movie-title">{movie.title}</h1>
      <img src={movie.image} alt={movie.title} className="movie-poster img-fluid mb-4" />
  
      <p className="movie-detail">
        <strong className="detail-label">Original Title:</strong> {movie.originalTitle}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Production Year:</strong> {movie.productionYear}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Event Type:</strong> {movie.eventType}
      </p>
      <p className="movie-detail">
        <strong className="detail-label special-detail">Start Time:</strong> {movie.startTime}
      </p>
      <p className="movie-detail">
        <strong className="detail-label special-detail">End Time:</strong> {movie.endTime}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Genres:</strong> {movie.genres}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Rating:</strong> 
        <img src={movie.ratingImageUrl} alt="Rating" className="rating-image" />
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Theatre and Auditorium:</strong> {movie.theatreAndAuditorium}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Presentation Method and Language:</strong> {movie.presentationMethodAndLanguage}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Spoken Language:</strong> {movie.spokenLanguage}
      </p>
      <p className="movie-detail">
        <strong className="detail-label">Subtitles:</strong> {movie.subtitleLanguage1}, {movie.subtitleLanguage2}
      </p>
  
      {movie.contentDescriptors.length > 0 && (
        <div className="content-descriptors">
          <strong className="detail-label">Content Descriptors:</strong>
          <ul className="content-descriptor-list">
            {movie.contentDescriptors.map((descriptor, index) => (
              <li key={index} className="content-descriptor-item">
                <img
                  src={descriptor.imageURL}
                  alt={descriptor.name}
                  className="descriptor-icon"
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
  
        <button className="btn btn-primary submit-review-btn" onClick={handleSubmitReview}>
          Submit Review
        </button>
  
        {feedback && <p className="review-feedback mt-3">{feedback}</p>}
      </div>
  
      {/* Add to Favorites */}
      <AddToFavorites movie={movieDetails} />
    </div>
  );
  
}

export default MovieDetailsPage;
