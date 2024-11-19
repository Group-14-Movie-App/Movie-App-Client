import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function MovieDetailsPage() {
  const location = useLocation();
  const movie = location.state?.movie;

  const [rating, setRating] = useState(0); // To hold the selected rating
  const [comment, setComment] = useState(''); // To hold the user's comment
  const [feedback, setFeedback] = useState(''); // To give feedback after submission

  if (!movie) {
    return <div>Movie details not found.</div>; // We can add an error message showing component here
  }

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      setFeedback('Please provide both a rating and a comment.');
      return;
    }

    // Ensure the releaseDate is in YYYY-MM-DD format
    const releaseDate = movie.productionYear
      ? `${movie.productionYear}-01-01` // If only the year is available, assume January 1st
      : movie.startTime.split('T')[0]; // If full date is available, use that

    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: 1, // Replace with the logged-in user's ID
          movieTitle: movie.title, // Use the movie title
          releaseDate, // Now sending the correct format
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
    <div className="container mt-4">
      <h1>{movie.title}</h1>
      <img src={movie.image} alt={movie.title} className="img-fluid mb-4" />

      <p><strong>Original Title:</strong> {movie.originalTitle}</p>
      <p><strong>Production Year:</strong> {movie.productionYear}</p>
      <p><strong>Event Type:</strong> {movie.eventType}</p>
      <p><strong>Start Time:</strong> {movie.startTime}</p>
      <p><strong>End Time:</strong> {movie.endTime}</p>
      <p><strong>Genres:</strong> {movie.genres}</p>
      <p><strong>Rating:</strong> <img src={movie.ratingImageUrl} alt="Rating" /></p>
      <p><strong>Theatre and Auditorium:</strong> {movie.theatreAndAuditorium}</p>
      <p><strong>Presentation Method and Language:</strong> {movie.presentationMethodAndLanguage}</p>
      <p><strong>Spoken Language:</strong> {movie.spokenLanguage}</p>
      <p><strong>Subtitles:</strong> {movie.subtitleLanguage1}, {movie.subtitleLanguage2}</p>

      {movie.contentDescriptors.length > 0 && (
        <div>
          <strong>Content Descriptors:</strong>
          <ul>
            {movie.contentDescriptors.map((descriptor, index) => (
              <li key={index}>
                <img
                  src={descriptor.imageURL}
                  alt={descriptor.name}
                  className="mr-2"
                  style={{ width: '20px' }}
                />
                {descriptor.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add Review Section */}
      <div className="review-section mt-5">
        <h3>Rate this Movie</h3>
        <div className="rating-stars mb-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              className={`star ${value <= rating ? 'selected' : ''}`}
              style={{
                fontSize: '2rem',
                color: value <= rating ? 'gold' : 'gray',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          className="form-control mb-3"
          rows="4"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleSubmitReview}>
          Submit Review
        </button>

        {feedback && <p className="mt-3 text-success">{feedback}</p>}
      </div>
    </div>
  );
}

export default MovieDetailsPage;
