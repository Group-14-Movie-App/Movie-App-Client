import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './screensStyles/ReviewsPage.css'; // Styling

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [movieDetails, setMovieDetails] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const [reviewRatings, setReviewRatings] = useState({});
  const [topRated, setTopRated] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All'); // Filter for ratings
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigate = useNavigate();

  // Fetch reviews for logged-in users
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Fetching reviews for logged-in user");
      fetch("http://localhost:5000/reviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch reviews");
          }
          return response.json();
        })
        .then((data) => setReviews(data))
        .catch((error) =>
          console.error("Error fetching reviews (logged-in):", error)
        );
    }
  }, []);

  // Fetch public reviews for non-logged users
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Fetching public reviews for non-logged user");
      fetch("http://localhost:5000/reviews/public", {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch public reviews");
          }
          return response.json();
        })
        .then((data) => setReviews(data))
        .catch((error) =>
          console.error("Error fetching public reviews:", error)
        );
    }
  }, []);

  // Calculate review counts and average ratings per movie
  useEffect(() => {
    const counts = {};
    const ratings = {};

    reviews.forEach((review) => {
      const title = review.movietitle;
      counts[title] = (counts[title] || 0) + 1;
      ratings[title] = (ratings[title] || 0) + review.rating;
    });

    Object.keys(ratings).forEach((title) => {
      ratings[title] = ((ratings[title] / counts[title]) * 20).toFixed(1);
    });

    setReviewCounts(counts);
    setReviewRatings(ratings);

    const sortedMovies = Object.entries(ratings)
      .sort(([, aRating], [, bRating]) => bRating - aRating)
      .slice(0, 5);
    setTopRated(sortedMovies);
  }, [reviews]);

  useEffect(() => {
    async function fetchMovieDetails() {
      const details = {};
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
          let matchedMovie = data.results?.[0] || null;

          if (!matchedMovie) {
            console.warn(
              `No match found for "${movieTitle}". Attempting broader search.`
            );

            const simplifiedTitle = movieTitle.split(":")[0];
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

  const uniqueMovies = Array.from(
    new Set(reviews.map((review) => review.movietitle))
  );

  // Filter movies based on search query and rating
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = uniqueMovies.filter((movieTitle) => {
      const reviewRating = reviewRatings[movieTitle] || 0;
      const matchesSearch = movieTitle.toLowerCase().includes(lowerCaseQuery);
      const matchesFilter =
        filter === 'All' || (filter === 'High' && reviewRating >= 80) || (filter === 'Low' && reviewRating < 80);
      return matchesSearch && matchesFilter;
    });
    setFilteredMovies(filtered);
  }, [searchQuery, filter, uniqueMovies, reviewRatings]);

  return (
    <div className="reviews-container">
      <h1 className="reviews-title">Reviews</h1>

      <div className="reviews-search-bar">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="reviews-search-input"
        />
        <select
          className="reviews-filter-dropdown"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Ratings</option>
          <option value="High">High Ratings (80%+)</option>
          <option value="Low">Low Ratings (&lt;80%)</option>
        </select>
        <button
          className="reviews-search-button"
          onClick={() => setFilteredMovies(filteredMovies)}
        >
          Search
        </button>
      </div>


      <h2 className="top-rated-title">Top Rated Movies</h2>
      <div className="reviews-grid">
        {topRated.map(([movieTitle, reviewRating]) => {
          const movie = movieDetails[movieTitle];
          const reviewCount = reviewCounts[movieTitle] || 0;

          const displayTitle = movie?.title || movieTitle;
          const displayReleaseYear = movie?.release_date
            ? new Date(movie.release_date).getFullYear()
            : "Unknown";

          return (
            <div key={movieTitle} className="review-card top-rated">
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
                  <p className="review-card-text">
                    <strong>Reviews:</strong> {reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                  <p className="review-card-text">
                    <strong>Rating:</strong> {reviewRating}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="all-reviews-title">Filtered Movies</h2>
      <div className="reviews-grid">
        {filteredMovies.map((movieTitle) => {
          const movie = movieDetails[movieTitle];
          const reviewCount = reviewCounts[movieTitle] || 0;
          const reviewRating = reviewRatings[movieTitle] || 0;

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
                  <p className="review-card-text">
                    <strong>Reviews:</strong> {reviewCount}{" "}
                    {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                  <p className="review-card-text">
                    <strong>Rating:</strong> {reviewRating}%
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
