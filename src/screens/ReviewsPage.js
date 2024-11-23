import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './screensStyles/ReviewsPage.css';

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const navigate = useNavigate();

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

          // Match the correct movie using title and release year
          const matchedMovie = data.results.find(
            (movie) =>
              movie.title === review.movietitle &&
              new Date(movie.release_date).getFullYear() ===
                new Date(review.releasedate).getFullYear()
          );

          const movieKey = `${review.movietitle}-${review.releasedate}`;
          details[movieKey] = matchedMovie || null;
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

  // Create unique movie keys by combining title and release date
  const uniqueMovies = Array.from(
    new Set(reviews.map((review) => `${review.movietitle}-${review.releasedate}`))
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-5">Reviews</h1>
      <div className="row">
        {uniqueMovies.map((movieKey) => {
          const [movieTitle, releaseDate] = movieKey.split('-');
          const movie = movieDetails[movieKey];
          return (
            <div key={movieKey} className="col-md-4">
              <div
                className="card mb-4 shadow-sm"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  navigate(
                    `/movie-reviews/${encodeURIComponent(movieTitle)}/${encodeURIComponent(
                      releaseDate
                    )}`
                  )
                }
              >
                {movie?.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    className="card-img-top"
                    alt={movieTitle}
                  />
                ) : (
                  <div
                    style={{
                      height: '300px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f0f0f0',
                    }}
                  >
                    <p>No Image Available</p>
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{movie?.title || movieTitle}</h5>
                  <p className="card-text">
                    Release Year: {new Date(releaseDate).getFullYear()}
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
