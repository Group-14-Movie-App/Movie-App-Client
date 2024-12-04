import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './screensStyles/MovieReviewsPage.css';

function MovieReviewsPage() {
  const { movieTitle, releaseDate } = useParams();
  const [reviews, setReviews] = useState([]);
  const [editingReviewID, setEditingReviewID] = useState(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedRating, setEditedRating] = useState(0);
  const loggedUser = JSON.parse(localStorage.getItem('user')); // Get logged-in user

  // Fetch reviews for the specific movie
  useEffect(() => {
    if (!movieTitle || !releaseDate) return;

    fetch(
      `http://localhost:5000/reviews?title=${encodeURIComponent(
        movieTitle
      )}&releaseDate=${encodeURIComponent(releaseDate)}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [movieTitle, releaseDate]);

  const handleEditSubmit = async (reviewID) => {
    if (!editedDescription.trim() || editedRating < 1 || editedRating > 5) {
      alert('Please provide a valid description and rating between 1 and 5.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/reviews/${reviewID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: loggedUser.userid,
          description: editedDescription,
          rating: editedRating,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewid === reviewID ? updatedReview.review : review,
          ),
        );
        setEditingReviewID(null);
      } else {
        console.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleDeleteReview = async (reviewID) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this review?',
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/reviews/${reviewID}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: loggedUser.userid, // Pass logged-in user's ID
        }),
      });

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.reviewid !== reviewID));
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <div className="movie-reviews-container mt-4">
      <h1 className="movie-reviews-title text-center mb-4">
        Reviews for {movieTitle} ({new Date(releaseDate).getFullYear()})
      </h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.reviewid} className="movie-reviews-card mb-3">
            <div className="movie-reviews-card-body">
              {editingReviewID === review.reviewid ? (
                <div className="movie-reviews-edit-popup">
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Edit your review..."
                    rows="4"
                    className="movie-reviews-textarea"
                  ></textarea>
                  <input
                    type="number"
                    value={editedRating}
                    onChange={(e) => setEditedRating(e.target.value)}
                    min="1"
                    max="5"
                    placeholder="Rating (1-5)"
                    className="movie-reviews-input"
                  />
                  <div className="movie-reviews-edit-buttons">
                    <button
                      className="movie-reviews-save-btn"
                      onClick={() => handleEditSubmit(review.reviewid)}
                    >
                      Save
                    </button>
                    <button
                      className="movie-reviews-cancel-btn"
                      onClick={() => setEditingReviewID(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h5 className="movie-reviews-card-title">
                    {review.firstname} {review.lastname} (User {review.userid})
                  </h5>
                  <p className="movie-reviews-card-text">{review.description}</p>
                  <p className="movie-reviews-card-text">
                    <strong>Rating:</strong> {review.rating} / 5
                  </p>
                  <p className="movie-reviews-card-timestamp">
                    <small>
                      {new Date(review.timestamp).toLocaleString()}
                    </small>
                  </p>
                  {loggedUser.userid === review.userid && (
                    <div className="movie-reviews-card-buttons">
                      <button
                        className="movie-reviews-edit-btn"
                        onClick={() => {
                          setEditingReviewID(review.reviewid);
                          setEditedDescription(review.description);
                          setEditedRating(review.rating);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="movie-reviews-delete-btn"
                        onClick={() => handleDeleteReview(review.reviewid)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="movie-reviews-no-data">No reviews available for this movie.</p>
      )}
    </div>
  );
  
  
}

export default MovieReviewsPage;
