import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MovieCards({ movieList }) {
  return (
    <div className="container">
      {movieList.map((movie) => (
        <div className="card h-100" key={movie.id}>
          {/* Move Poster */}
          <img src={movie.image} className="card-img-top" alt={movie.title} />
          <div className="card-body">
            {/* Movie Title */}
            <h3 className="card-title">{movie.title}</h3>
            {/* Movie Rating */}
            <p className="card-text">
              <strong>Rating:</strong> {movie.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MovieCards;
