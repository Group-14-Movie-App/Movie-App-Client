import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieReviewsPage() {
  const { movieTitle, releaseDate } = useParams();
  const [reviews, setReviews] = useState([]);
  const [editingReviewID, setEditingReviewID] = useState(null); // Track which review is being edited
  const [editedDescription, setEditedDescription] = useState(''); // Hold new description
  const [editedRating, setEditedRating] = useState(0); // Hold new rating
  const loggedUser = JSON.parse(localStorage.getItem('user')); // Get logged-in user

  // Fetch reviews for the specific movie
  useEffect(() => {
    fetch(
      `http://localhost:5000/reviews?title=${encodeURIComponent(
        movieTitle
      )}&releaseDate=${encodeURIComponent(releaseDate)}`
    )
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, [movieTitle, releaseDate]);

  // Handle Edit Submit
  const handleEditSubmit = async (reviewID) => {
    try {
      const response = await fetch(`http://localhost:5000/reviews/${reviewID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: loggedUser.userid, // Pass logged-in user's ID
          description: editedDescription,
          rating: editedRating,
        }),
      });

      if (response.ok) {
        const updatedReview = await response.json();
        // Update reviews state
        setReviews((prev) =>
          prev.map((review) =>
            review.reviewid === reviewID ? updatedReview.review : review
          )
        );
        setEditingReviewID(null); // Exit edit mode
      } else {
        console.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">
        Reviews for {movieTitle} ({new Date(releaseDate).getFullYear()})
      </h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.reviewid} className="card mb-3">
            <div className="card-body">
              {editingReviewID === review.reviewid ? (
                <>
                  {/* Editing Mode */}
                  <textarea
                    className="form-control mb-2"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Edit your review"
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    value={editedRating}
                    onChange={(e) => setEditedRating(e.target.value)}
                    min="1"
                    max="5"
                  />
                  <button
                    className="btn btn-success mr-2"
                    onClick={() => handleEditSubmit(review.reviewid)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditingReviewID(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {/* Display Mode */}
                  <h5 className="card-title">
                    {review.firstname} {review.lastname} (User {review.userid})
                  </h5>
                  <p className="card-text">{review.description}</p>
                  <p className="card-text">
                    <strong>Rating:</strong> {review.rating} / 5
                  </p>
                  <p className="card-text">
                    <small className="text-muted">
                      {new Date(review.timestamp).toLocaleString()}
                    </small>
                  </p>
                  {loggedUser.userid === review.userid && (
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingReviewID(review.reviewid);
                        setEditedDescription(review.description);
                        setEditedRating(review.rating);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
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
