import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TmdbMovieDetails() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [tmdbReviews, setTmdbReviews] = useState([]);
  const accessToken = process.env.REACT_APP_TMDB_ACCESS_TOKEN;

  // Fetch TMDb movieDetails
  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const movieResponse = await fetch(
          `http://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const movieData = await movieResponse.json();
        setMovieDetails(movieData);

        // Fetch TMDb reviews
        const reviewsResponse = await fetch(
          `http://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US`,
          {
            headers: {
              accept: "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const reviewData = await reviewsResponse.json();
        setTmdbReviews(reviewData.results || []);

        // Fetch user revews from local database
        const userReviewsResponse = await fetch(
          `http://localhost:5000/reviews?movieId=${movieId}`
        );
        const userReviewData = await userReviewsResponse.json();
        setUserReviews(userReviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchMovieDetails();
  }, [movieId, accessToken]);

  return (
    <div className="container mt-4">
      {movieDetails ? (
        <>
          <div className="row mb-4">
            <div className="col-md-4">
              {movieDetails.poster_path && (
                <img
                  src={`http://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                  alt={movieDetails.title}
                  className="img-fluid rounded"
                />
              )}
            </div>
            <div className="col-md-8">
              <h1>{movieDetails.title}</h1>
              <p>{movieDetails.release_date}</p>
              <p>{movieDetails.genres.map((g) => g.name).join(", ")}</p>
              <p>
                <strong>Overview:</strong>
                {movieDetails.overview}
              </p>
            </div>
          </div>
          <hr />

          <div className="reviews-section">
            <h2>Reviews</h2>
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div key={review.reviewid} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">
                      {review.firstname} {review.lastname} (User {review.userid}
                      )
                    </h5>
                    <p className="card-text">{review.description}</p>
                    <p className="card-text">
                      <strong>Rating:</strong> {review.rating}
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
              <p>No user reviews available for this movie.</p>
            )}
            <hr />

            {/* TMDb reviews */}
            {tmdbReviews.length > 0 ? (
              tmdbReviews.map((review) => (
                <div key={review.id} className="card mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{review.author}</h5>
                    <p className="card-text">{review.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No TMDb reviews available.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
}
