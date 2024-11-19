import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './screensStyles/ReviewsPage.css'; // For additional styling

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const navigate = useNavigate(); // React Router navigation

  // Fetch reviews from the backend
  useEffect(() => {
    fetch('http://localhost:5000/reviews')
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error('Error fetching reviews:', error));
  }, []);

  // Fetch movie details from TMDB API
  useEffect(() => {
    async function fetchMovieDetails() {
      const details = {};

      for (const review of reviews) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
              review.movietitle
            )}&language=en-US&page=1&include_adult=false`,
            {
              method: 'GET',
              headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZDFkYTNlOWMzM2Y2NGQ2ZWYyYTA4NmIyMGE1NjJmOCIsIm5iZiI6MTczMTMwNjE5MC4wODgzNjEzLCJzdWIiOiI2NzMxNDAzMDJhNGNiYzJhMTJmNjY2MWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.lCbmcCPeYybrfMJ2SvqQyT_zZVb7bV6FyPYPZ14B5G4',
              },
            }
          );
          const data = await response.json();
          if (data.results.length > 0) {
            details[review.movietitle] = data.results[0];
          } else {
            details[review.movietitle] = null;
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
      setMovieDetails(details);
    }

    if (reviews.length > 0) {
      fetchMovieDetails();
    }
  }, [reviews]);

  // Extract unique movies
  const uniqueMovies = Array.from(
    new Set(reviews.map((review) => review.movietitle))
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-5">Reviews</h1>
      <div className="row">
        {uniqueMovies.map((movieTitle) => {
          const movie = movieDetails[movieTitle];
          return (
            <div key={movieTitle} className="col-md-4">
              <div
                className="card mb-4 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/movie-reviews/${encodeURIComponent(movieTitle)}`)}
              >
                {movie?.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="card-img-top"
                    alt={movieTitle}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{movieTitle}</h5>
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
