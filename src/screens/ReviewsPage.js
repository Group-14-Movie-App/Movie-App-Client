import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './screensStyles/ReviewsPage.css'; // Styling

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const navigate = useNavigate();

  // Fetch reviews from the backend
  useEffect(() => {
  const token = localStorage.getItem("token"); // Retrieve JWT token

  fetch("http://localhost:5000/reviews", {
    headers: {
      Authorization: `Bearer ${token}`, // Include JWT token
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    })
    .then((data) => setReviews(data))
    .catch((error) => console.error("Error fetching reviews:", error));
}, []);


useEffect(() => {
  async function fetchMovieDetails() {
    const details = {};

    // Group reviews by movie title to avoid duplicates
    const uniqueMovies = Array.from(
      new Set(reviews.map((review) => review.movietitle))
    );

    for (const movieTitle of uniqueMovies) {
      try {
        let response = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            movieTitle
          )}&language=en-US&page=1&include_adult=false`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
            },
          }
        );

        let data = await response.json();

        // Get the most relevant movie (first result)
        let matchedMovie = data.results?.[0] || null;

        if (!matchedMovie) {
          console.warn(`No match found for "${movieTitle}". Attempting broader search.`);

          // Fallback: Broaden the search by dropping subtitles or specific terms
          const simplifiedTitle = movieTitle.split(":")[0]; // Use only the main title
          response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              simplifiedTitle
            )}&language=en-US&page=1&include_adult=false`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
              },
            }
          );

          data = await response.json();
          matchedMovie = data.results?.[0] || null;
        }

        details[movieTitle] = matchedMovie;
      } catch (error) {
        console.error(`Error fetching details for "${movieTitle}":`, error);
      }
    }
    setMovieDetails(details);
  }

  if (reviews.length > 0) {
    fetchMovieDetails();
  }
}, [reviews]);


  // Create unique list of movies by title
  const uniqueMovies = Array.from(
    new Set(reviews.map((review) => review.movietitle))
  );

  return (
  <div className="reviews-container">
    <h1 className="reviews-title">Reviews</h1>
    <div className="reviews-grid">
      {uniqueMovies.map((movieTitle) => {
        const movie = movieDetails[movieTitle];

        // Use dynamically fetched title and year
        const displayTitle = movie?.title || movieTitle;
        const displayReleaseYear = movie?.release_date
          ? new Date(movie.release_date).getFullYear()
          : "Unknown";

        return (
          <div key={movieTitle} className="review-card">
            <div
              className="review-card-content"
              onClick={() =>
                navigate(
                  `/movie-reviews/${encodeURIComponent(displayTitle)}/${displayReleaseYear}`
                )
              }
            >
              {movie?.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  className="review-card-img"
                  alt={displayTitle}
                />
              ) : (
                <div className="review-card-placeholder">
                  <p>No Image Available</p>
                </div>
              )}
              <div className="review-card-body">
                <h5 className="review-card-title">{displayTitle}</h5>
                <p className="review-card-text">
                  Release Year: {displayReleaseYear}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

}

export default ReviewsPage;
