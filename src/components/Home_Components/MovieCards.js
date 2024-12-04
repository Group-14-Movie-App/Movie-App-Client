import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MovieCards.css"; // Import the new CSS file

function MovieCards({ movieList, isTmdbMovies = false, onCardClick }) {
  const handleCardClick = (movie) => {
    onCardClick(movie);
  };

  return (
    <div className="container">
      <div className="row">
        {movieList.map((movie) => (
          <div className="col-lg-2 col-sm-4 mb-4" key={movie.id}>
            <div
              className="card h-100 shadow-sm"
              onClick={() => handleCardClick(movie)}
            >
              <img
                src={
                  isTmdbMovies
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Use `poster_path` for TMDb
                    : movie.image // Use `image` for Finnkino
                }
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  <strong>Rating:</strong> {movie.vote_average || movie.rating || "N/A"} {/* Handle rating */}
                </p>
                {movie.release_date && (
                  <p className="card-text">
                    <strong>Release Date:</strong> {movie.release_date}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCards;
