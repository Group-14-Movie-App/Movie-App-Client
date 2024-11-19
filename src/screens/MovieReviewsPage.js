import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieReviewsPage() {
  const { movieTitle } = useParams(); // Get movie title from URL
  const [reviews, setReviews] = useState([]);

  // Fetch reviews for the specific movie
  useEffect(() => {
    fetch(`http://localhost:5000/reviews?title=${encodeURIComponent(movieTitle)}`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [movieTitle]);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Reviews for {movieTitle}</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.reviewid} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">User {review.userid}</h5>
              <p className="card-text">{review.description}</p>
              <p className="card-text">
                <strong>Rating:</strong> {review.rating} / 5
              </p>
              <p className="card-text">
                <small className="text-muted">
                  {new Date(review.timestamp).toLocaleString()}
                </small>
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available for this movie.</p>
      )}
    </div>
  );
}

export default MovieReviewsPage;
